import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { CategorizationResult } from "@/types/api/ai/categorize";
import { Comment } from "@/types/db/comment";
import { Category, CommentGroup } from "@/types/db/comment-group";
import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";
import { Analysis } from "@/types/db/analysis";

export async function POST(request: NextRequest) {
	try {
		const { comments }: { comments: Comment[] } = await request.json();

		if (!process.env.GEMINI_API_KEY) {
			throw new Error("GEMINI_API_KEY environment variable is required");
		}

		const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

		const prompt = `
         Analyze the following YouTube comments and perform these tasks:

         1. **Identify natural categories** - Based on the content and themes of the comments, create meaningful categories that best represent the different types of feedback/topics discussed. Don't use predefined categories - let the data guide you.

         2. **Categorize each comment** - Assign each comment to the most appropriate category you created.

         3. **Provide comprehensive analysis** - Give detailed insights about the overall comment patterns, sentiment, and key themes.

         Guidelines:
         - Create between 3-8 categories based on what you observe
         - Category names should be concise but descriptive
         - Each category should have at least one comment
         - If comments are very diverse, create broader categories
         - If comments cluster around specific themes, create specific categories
			- For each category, assign an appropriate Lucide React icon name that visually represents the category theme
         - Use only valid Lucide React icon names (e.g., "Heart", "MessageCircle", "ThumbsUp", "Star", "Users", "Video", "Music", "Settings", "Lightbulb", "Target", "TrendingUp", "Camera", "Mic", "Edit", "Play", "Volume2", "Smile", "AlertCircle", "CheckCircle", "Info", "Award", "Bookmark", "Clock", "Eye", "Globe", "Home", "Search", "Send", "Share", "Tool", "Zap", etc.)
         - Analyze overall sentiment of comment; pay attention to emojis (positive, negative, neutral)
         - Identify key themes and topics discussed
         - Note any interesting patterns or trends

         Comments to analyze:
         ${comments
				.map(
					(comment: Comment, index: number) =>
						`${index + 1}. "${comment.text}"`
				)
				.join("\n")}

         Return your analysis as a JSON object with this exact structure:
         {
         "categories": [
            {
               "name": "category_name",
               "description": "brief description of what this category represents",
               "count": number_of_comments_in_category,
               "icon": "lucide_icon_name"
            }
         ],
         "comments": [
            {
               "category_name": "category name for comment",
               "sentiment": "positive" | "negative" | "neutral"
            }
         ],
         "overallSummary": {
            "sentiment": {
               "overall": "positive/negative/neutral",
               "positive": number_of_positive_comments,
               "negative": number_of_negative_comments,
               "neutral": number_of_neutral_comments
            },
            "keyThemes": [
               "list of main themes or topics discussed"
            ],
            "engagement": {
               "level": "high/medium/low",
               "description": "analysis of how engaged the audience seems"
            },
            "mainTakeaways": "comprehensive summary (in the same language as comments) of what these comments reveal about the video/content and audience reaction",
            "recommendations": "suggestions for content creator based on the comment analysis"
         }
         }

         Return ONLY the JSON object, no other text.
            `;

		const response = await ai.models.generateContent({
			model: "gemini-2.0-flash",
			contents: prompt,
			config: {
				responseMimeType: "application/json",
			},
		});

		const jsonText = response.text;
		const result = JSON.parse(jsonText || "{}");

		const categoryNameToId: Record<string, string> = {};

		// Walidacja kategorii i tworzenie ID
		if (!result.categories || !Array.isArray(result.categories)) {
			throw new Error("Invalid AI response: categories array is missing");
		}

		result.categories.forEach((cat: any) => {
			if (!cat.name) {
				throw new Error("Invalid category: name is missing");
			}
			const uuid = randomUUID();
			categoryNameToId[cat.name.trim()] = uuid;
		});

		const categoryCommentCounts: Record<string, number> = {};

		// Walidacja komentarzy i liczenie
		if (!result.comments || !Array.isArray(result.comments)) {
			throw new Error("Invalid AI response: comments array is missing");
		}

		result.comments?.forEach(
			(comment: {
				category_name: string;
				sentiment: "positive" | "negative" | "neutral";
			}) => {
				if (!comment.category_name) {
					throw new Error("Invalid comment: category_name is missing");
				}
				const catName = comment.category_name.trim();
				categoryCommentCounts[catName] =
					(categoryCommentCounts[catName] || 0) + 1;
			}
		);

		const validatedResult: CategorizationResult = {
			categories:
				result.categories?.map(
					(cat: any): CommentGroup => ({
						id: categoryNameToId[cat.name.trim()],
						video_id: comments[0].video_id,
						created_at: new Date()
							.toISOString()
							.replace("T", " ")
							.replace("Z", ""),
						name: cat.name?.trim() || "Unknown",
						description: cat.description || "No description",
						count: categoryCommentCounts[cat.name.trim()] || 0,
						icon: cat.icon || "MessageCircle",
						video_youtube_id: comments[0].video_youtube_id,
					})
				) || [],
			comments:
				result.comments?.map(
					(
						comment: {
							category_name: string;
							sentiment: "positive" | "negative" | "neutral";
						},
						index: number
					): Comment => {
						const trimmedCategoryName = comment.category_name.trim();
						const categoryId = categoryNameToId[trimmedCategoryName];

						if (!categoryId) {
							console.error(
								`Category not found for name: ${trimmedCategoryName}`
							);
							throw new Error(
								`Category not found: ${trimmedCategoryName}`
							);
						}

						return {
							id: comments[index]?.id || `comment_${index}`,
							youtube_comment_id: comments[index]?.youtube_comment_id,
							video_id: comments[index]?.video_id || "",
							author_name: comments[index]?.author_name || "Unknown",
							text: comments[index]?.text || "",
							sentiment: comment.sentiment,
							created_at:
								comments[index]?.created_at ||
								new Date()
									.toISOString()
									.replace("T", " ")
									.replace("Z", ""),
							avatar: comments[index]?.avatar || "",
							likes: comments[index]?.likes || 0,
							category_id: categoryId,
							video_youtube_id: comments[0].video_youtube_id,
						};
					}
				) || [],
			overallSummary: {
				sentiment: {
					overall: result.overallSummary?.sentiment?.overall || "neutral",
					positive: result.overallSummary?.sentiment?.positive || 0,
					negative: result.overallSummary?.sentiment?.negative || 0,
					neutral: result.overallSummary?.sentiment?.neutral || 0,
				},
				keyThemes: result.overallSummary?.keyThemes || [],
				engagement: {
					level: result.overallSummary?.engagement?.level || "medium",
					description:
						result.overallSummary?.engagement?.description ||
						"Standard engagement level",
				},
				mainTakeaways:
					result.overallSummary?.mainTakeaways ||
					"No main takeaways available",
				recommendations:
					result.overallSummary?.recommendations ||
					"No recommendations available",
			},
		};

		const supabase = await createClient();

		// Delete existing comment groups for this video
		const { error: deleteError } = await supabase
			.from("comment_groups")
			.delete()
			.eq("video_youtube_id", comments[0].video_youtube_id);

		if (deleteError) {
			console.error("Error deleting existing comment groups:", deleteError);
			return NextResponse.json(
				{
					error: "Failed to delete existing comment groups",
					details: deleteError.message,
				},
				{ status: 500 }
			);
		}

		// Insert new comment groups
		const { error: insertError } = await supabase
			.from("comment_groups")
			.insert(validatedResult.categories);

		if (insertError) {
			console.error("Error inserting comment groups:", insertError);
			return NextResponse.json(
				{
					error: "Failed to insert comment groups",
					details: insertError.message,
				},
				{ status: 500 }
			);
		}

		//Upserting comments
		const { error: commentsUpsertError } = await supabase
			.from("comments")
			.upsert(validatedResult.comments, {
				onConflict: "youtube_comment_id",
				ignoreDuplicates: false,
			});

		if (commentsUpsertError) {
			console.error("Error upserting comments:", commentsUpsertError);
			return NextResponse.json(
				{
					error: "Failed to upsert comments",
					details: commentsUpsertError?.message,
				},
				{ status: 500 }
			);
		}

		// Updating videos comments_fetched field

		const { error: updateVideoCommentsFetchedStatusError } = await supabase
			.from("videos")
			.update({ comments_fetched: true })
			.eq("youtube_id", comments[0].video_youtube_id);

		if (updateVideoCommentsFetchedStatusError) {
			console.error(
				"Error updating video:",

				updateVideoCommentsFetchedStatusError?.message
			);
			return NextResponse.json(
				{
					error: "Failed to update video",
					details: updateVideoCommentsFetchedStatusError?.message,
				},
				{ status: 500 }
			);
		}

		const analysisData: Analysis = {
			youtube_video_id: comments[0].video_youtube_id,
			summary: result.overallSummary?.mainTakeaways,
			positive_count: result.overallSummary?.sentiment?.positive,
			negative_count: result.overallSummary?.sentiment?.negative,
			neutral_count: result.overallSummary?.sentiment?.neutral,
			created_at: new Date()
				.toISOString()
				.replace("T", " ")
				.replace("Z", ""),
		};
		const { error: insertAnalysisDataError } = await supabase
			.from("analysis")
			.upsert(analysisData, {
				onConflict: "youtube_video_id",
				ignoreDuplicates: false,
			});

		if (insertAnalysisDataError) {
			console.error(
				"Error inserting analysis data:",
				insertAnalysisDataError
			);
			return NextResponse.json(
				{
					error: "Failed to insert analysis data",
					details: insertAnalysisDataError?.message,
				},
				{ status: 500 }
			);
		}
		return NextResponse.json(validatedResult, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Error analyzing comments:", error);
		return NextResponse.json(
			{
				error: "Failed to analyze comments",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	}
}
