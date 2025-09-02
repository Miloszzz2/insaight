import { Comment } from "@/types/db/comment";
import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		
		// Validate video ID parameter
		if (!id || typeof id !== 'string' || id.trim().length === 0) {
			return NextResponse.json(
				{ error: "Invalid video ID parameter" },
				{ status: 400 }
			);
		}

		// Validate YouTube video ID format (11 characters, alphanumeric + - _)
		if (!/^[a-zA-Z0-9_-]{11}$/.test(id)) {
			return NextResponse.json(
				{ error: "Invalid YouTube video ID format" },
				{ status: 400 }
			);
		}

		const supabase = await createClient();
		
		// Parse and validate request body
		let requestBody;
		try {
			requestBody = await request.json();
		} catch {
			return NextResponse.json(
				{ error: "Invalid JSON in request body" },
				{ status: 400 }
			);
		}

		const { numComments } = requestBody;

		// Validate numComments parameter
		if (numComments === undefined || numComments === null) {
			return NextResponse.json(
				{ error: "numComments parameter is required" },
				{ status: 400 }
			);
		}

		if (!Number.isInteger(numComments) || numComments < 1 || numComments > 10000) {
			return NextResponse.json(
				{ error: "numComments must be an integer between 1 and 10000" },
				{ status: 400 }
			);
		}

		const maxResults = 100;
		let fetched = 0;
		let nextPageToken = undefined;
		let allItems: any[] = [];

		while (fetched < numComments) {
			const remaining = numComments - fetched;
			const batchSize: number = Math.min(maxResults, remaining);
			const url: string =
				`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${id}` +
				`&key=${process.env.YOUTUBE_API_KEY}` +
				`&maxResults=${batchSize}` +
				`&order=relevance&textFormat=plainText` +
				(nextPageToken ? `&pageToken=${nextPageToken}` : "");

			const commentsThreadsData: Response = await fetch(url);
			if (!commentsThreadsData.ok) {
				throw new Error("Failed to fetch from YouTube API");
			}
			const data: any = await commentsThreadsData.json();

			allItems = allItems.concat(data.items || []);
			fetched = allItems.length;
			nextPageToken = data.nextPageToken;
			if (!nextPageToken || !data.items || data.items.length === 0) break;
		}
		const { data: video_id } = await supabase
			.from("videos")
			.select("id")
			.eq("youtube_id", id);

		const comments: Comment[] = allItems.slice(0, numComments).map(
			(item: any): Comment => ({
				id: randomUUID(),
				youtube_comment_id: item.id,
				video_id: video_id && video_id.length > 0 ? video_id[0].id : "",
				author_name: item.snippet.topLevelComment.snippet.authorDisplayName,
				text: item.snippet.topLevelComment.snippet.textDisplay,
				sentiment: "neutral",
				created_at: new Date(
					item.snippet.topLevelComment.snippet.publishedAt
				)
					.toISOString()
					.replace("T", " ")
					.replace("Z", ""),
				avatar: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
				likes: item.snippet.topLevelComment.snippet.likeCount,
				category_id: "Unmatched",
				video_youtube_id: id || " ",
			})
		);

		return NextResponse.json(comments ?? []);
	} catch (error) {
		// Log error for debugging (consider using structured logging in production)
		if (process.env.NODE_ENV === 'development') {
			console.error("Error fetching comments:", error);
		}
		
		return NextResponse.json(
			{
				error: "Failed to fetch comments",
				// Only include error details in development
				...(process.env.NODE_ENV === 'development' && {
					details: error instanceof Error ? error.message : String(error),
				}),
			},
			{ status: 500 }
		);
	}
}
