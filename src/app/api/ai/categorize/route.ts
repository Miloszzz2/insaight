import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { CategorizationResult } from "@/types/api/ai/categorize";
import { Comment } from "@/types/db/comment";
import { Category, CommentGroup } from "@/types/db/comment-group";
import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
	try {
		const { comments }: { comments: Comment[] } = await request.json();
		if (!process.env.GEMINI_API_KEY) {
			throw new Error("GEMINI_API_KEY environment variable is required");
		}

		const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
		console.log(comments.length);
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
         - Provide reasoning for each comment assignment
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
               "category": "assigned_category_name",
               "sentiment": "positive" | "negative" | "neutral"
            }
         ],
         "overallSummary": {
            "sentiment": {
               "overall": "positive/negative/neutral/mixed",
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

		const validatedResult: CategorizationResult = {
			categories:
				result.categories?.map(
					(cat: Category, index: number): CommentGroup => ({
						id: randomUUID(),
						video_id: comments[index].video_id,
						created_at: comments[index].created_at,
						name: cat.name || "Unknown",
						description: cat.description || "No description",
						count: cat.count || 0,
						icon: cat.icon || "MessageCircle",
					})
				) || [],
			comments:
				result.comments?.map(
					(
						comment: {
							category: string;
							sentiment: "positive" | "negative" | "neutral";
						},
						index: number
					): Comment => ({
						id: comments[index]?.id || `comment_${index}`,
						youtube_comment_id: comments[index]?.youtube_comment_id,
						video_id: comments[index]?.video_id || "",
						author_name: comments[index]?.author_name || "Unknown",
						text: comments[index]?.text || "",
						sentiment:
							comment.sentiment ||
							comments[index]?.sentiment ||
							"neutral",
						created_at: comments[index]?.created_at || "",
						avatar: comments[index]?.avatar || "",
						likes: comments[index]?.likes || 0,
						category: comment.category || "uncategorized",
					})
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

		const { error } = await supabase
			.from("comments")
			.upsert(validatedResult.comments, {
				onConflict: "youtube_comment_id",
				ignoreDuplicates: true,
			});

		const { count: commentGroupsCount, error: selectCommentGroupsError } =
			await supabase
				.from("comment_groups")
				.select("*", { count: "exact", head: true })
				.eq("video_id", comments[0]?.video_id);

		console.log(commentGroupsCount);

		if (selectCommentGroupsError) {
			console.error(
				"Error checking existing comment group:",
				selectCommentGroupsError
			);
			return NextResponse.json(
				{
					error: "Failed to check existing comment group",
					details: selectCommentGroupsError.message,
				},
				{ status: 500 }
			);
		}

		if (commentGroupsCount == 0) {
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
		}

		if (error) {
			console.error("Error upserting comments:", error);
			return NextResponse.json(
				{ error: "Failed to upsert comments", details: error?.message },
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
