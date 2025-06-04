import natural from "natural";
import type { NextRequest } from "next/server";

import { Comment } from "@/types/db/comment";
import {
	SentimentResult,
	TextStatistics,
	CommentAnalysis,
	AnalysisSummary,
	RequestBody,
	ApiErrorResponse,
	AnalyzedCommentsApiResponse,
} from "@/types/api/ai/sentiment-analysis";

const SentimentAnalyzer = natural.SentimentAnalyzer;
const stemmer = natural.PorterStemmer;
const analyzer = new SentimentAnalyzer("English", stemmer, "afinn");

const tokenizer = new natural.WordTokenizer();

function analyzeSentimentWithNatural(text: string): SentimentResult {
	try {
		const tokens = tokenizer.tokenize(text.toLowerCase());

		if (!tokens || tokens.length === 0) {
			return {
				sentiment: "neutral",
				confidence: 0,
				score: 0,
				simpleScore: 0,
				tokens: 0,
				processedTokens: [],
			};
		}

		// Stem the tokens
		const stemmedTokens = tokens.map((token: string) => stemmer.stem(token));

		// Get sentiment score using AFINN analyzer
		const score = analyzer.getSentiment(stemmedTokens);

		// Calculate a simple normalized score based on the AFINN result
		const simpleScore = Math.max(-1, Math.min(1, score * 2));

		// Determine sentiment based on score
		let sentiment: "positive" | "negative" | "neutral";
		let confidence: number;

		if (score > 0.1) {
			sentiment = "positive";
			confidence = Math.min(score, 1);
		} else if (score < -0.1) {
			sentiment = "negative";
			confidence = Math.min(Math.abs(score), 1);
		} else {
			sentiment = "neutral";
			confidence = 1 - Math.abs(score);
		}

		return {
			sentiment,
			confidence: Math.round(confidence * 100) / 100,
			score: Math.round(score * 100) / 100,
			simpleScore: Math.round(simpleScore * 100) / 100,
			tokens: tokens.length,
			processedTokens: stemmedTokens,
		};
	} catch (error) {
		console.error("Error in sentiment analysis:", error);
		return {
			sentiment: "neutral",
			confidence: 0,
			score: 0,
			simpleScore: 0,
			tokens: 0,
			processedTokens: [],
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

function getTextStatistics(text: string): TextStatistics {
	// Use a simple sentence splitting approach since SentenceTokenizer might not be available
	const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
	const words = tokenizer.tokenize(text);

	return {
		characters: text.length,
		words: words ? words.length : 0,
		sentences: sentences ? sentences.length : 0,
		averageWordsPerSentence:
			sentences && sentences.length > 0
				? Math.round(((words?.length || 0) / sentences.length) * 100) / 100
				: 0,
	};
}

function validateComments(comments: unknown): Comment[] {
	if (!comments) {
		throw new Error("Comments are required");
	}

	if (!Array.isArray(comments)) {
		throw new Error("Comments must be an array");
	}

	if (comments.length === 0) {
		throw new Error("At least one comment is required");
	}

	for (const comment of comments) {
		if (!comment || typeof comment !== "object") {
			throw new Error("All comments must be valid comment objects");
		}

		const c = comment as Comment;
		if (
			!c.id ||
			!c.text ||
			typeof c.text !== "string" ||
			c.text.trim().length === 0
		) {
			throw new Error(
				"All comments must have valid id and non-empty text fields"
			);
		}
	}

	return comments as Comment[];
}

function processComments(
	commentsArray: Comment[],
	includeStats: boolean = false
): CommentAnalysis[] {
	return commentsArray.map((comment) => {
		const trimmedText = comment.text.trim();
		const sentimentResult = analyzeSentimentWithNatural(trimmedText);
		const stats = includeStats ? getTextStatistics(trimmedText) : undefined;

		return {
			...comment,
			originalSentiment: comment.sentiment,
			...sentimentResult,
			...(stats && { statistics: stats }),
		};
	});
}

function calculateSummary(results: CommentAnalysis[]): AnalysisSummary {
	const totalComments = results.length;
	const sentimentCounts = results.reduce((acc, result) => {
		acc[result.sentiment] = (acc[result.sentiment] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	const averageConfidence =
		results.reduce((sum, result) => sum + result.confidence, 0) /
		totalComments;
	const averageScore =
		results.reduce((sum, result) => sum + result.score, 0) / totalComments;

	// Calculate sentiment changes between original and analyzed
	const sentimentChanges = results.reduce(
		(acc, result) => {
			if (result.originalSentiment !== result.sentiment) {
				acc.total++;

				// Check if sentiment improved or worsened
				const originalScore =
					result.originalSentiment === "positive"
						? 1
						: result.originalSentiment === "negative"
						? -1
						: 0;
				const newScore =
					result.sentiment === "positive"
						? 1
						: result.sentiment === "negative"
						? -1
						: 0;

				if (newScore > originalScore) {
					acc.improved++;
				} else if (newScore < originalScore) {
					acc.worsened++;
				}
			} else {
				acc.unchanged++;
			}
			return acc;
		},
		{ total: 0, improved: 0, worsened: 0, unchanged: 0 }
	);

	return {
		totalComments,
		sentimentDistribution: {
			positive: sentimentCounts.positive || 0,
			negative: sentimentCounts.negative || 0,
			neutral: sentimentCounts.neutral || 0,
		},
		averageConfidence: Math.round(averageConfidence * 100) / 100,
		averageScore: Math.round(averageScore * 100) / 100,
		analyzer: "Natural.js with AFINN",
		sentimentChanges,
	};
}

// For App Router (Next.js 13+)
export async function POST(request: NextRequest): Promise<Response> {
	try {
		const body: RequestBody = await request.json();
		const { comments, includeStats = false } = body;

		// Validate and process comments
		const commentsArray = validateComments(comments);
		const results = processComments(commentsArray, includeStats);
		const summary = calculateSummary(results);

		const response: AnalyzedCommentsApiResponse = {
			success: true,
			data: {
				results,
				summary,
			},
		};

		return Response.json(response);
	} catch (error) {
		console.error("Sentiment analysis error:", error);

		const errorResponse: ApiErrorResponse = {
			error:
				error instanceof Error ? error.message : "Internal server error",
			...(process.env.NODE_ENV === "development" && {
				message: error instanceof Error ? error.stack : undefined,
			}),
		};

		const status =
			error instanceof Error && error.message.includes("required")
				? 400
				: 500;

		return Response.json(errorResponse, { status });
	}
}

/*
Usage Examples:

1. Analyze YouTube comments:
POST /api/analyze-sentiment
{
  "comments": [
    {
      "id": "1",
      "youtube_comment_id": "UgzKjN8hVxQ",
      "video_id": "abc123",
      "author_name": "John Doe",
      "text": "This video is absolutely amazing! Great content!",
      "sentiment": "neutral",
      "published_at": "2024-01-15T10:30:00Z",
      "created_at": "2024-01-15T10:30:00Z",
      "avatar": "https://example.com/avatar.jpg",
      "likes": 5
    },
    {
      "id": "2",
      "youtube_comment_id": "UgzKjN8hVxR",
      "video_id": "abc123",
      "author_name": "Jane Smith",
      "text": "I really hate this approach, it's terrible",
      "sentiment": "neutral",
      "published_at": "2024-01-15T11:00:00Z",
      "created_at": "2024-01-15T11:00:00Z",
      "avatar": "https://example.com/avatar2.jpg",
      "likes": 0
    }
  ]
}

2. With text statistics:
POST /api/analyze-sentiment
{
  "comments": [...],
  "includeStats": true
}

Response format:
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "1",
        "youtube_comment_id": "UgzKjN8hVxQ",
        "video_id": "abc123",
        "author_name": "John Doe",
        "text": "This video is absolutely amazing! Great content!",
        "originalSentiment": "neutral",
        "sentiment": "positive",
        "confidence": 0.85,
        "score": 0.75,
        "simpleScore": 0.8,
        "tokens": 8,
        "processedTokens": ["video", "absolut", "amaz", "great", "content"],
        "published_at": "2024-01-15T10:30:00Z",
        "created_at": "2024-01-15T10:30:00Z",
        "avatar": "https://example.com/avatar.jpg",
        "likes": 5,
        "statistics": {
          "characters": 48,
          "words": 8,
          "sentences": 2,
          "averageWordsPerSentence": 4
        }
      }
    ],
    "summary": {
      "totalComments": 2,
      "sentimentDistribution": {
        "positive": 1,
        "negative": 1,
        "neutral": 0
      },
      "averageConfidence": 0.82,
      "averageScore": 0.15,
      "analyzer": "Natural.js with AFINN",
      "sentimentChanges": {
        "total": 2,
        "improved": 1,
        "worsened": 1,
        "unchanged": 0
      }
    }
  }
}

Error response:
{
  "error": "Comments are required"
}
*/
