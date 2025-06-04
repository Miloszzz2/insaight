import { Comment } from "@/types/db/comment";

import { createClient } from "@/utils/supabase/server";

import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		const supabase = await createClient();

		const commentsThreads = await fetch(
			`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${id}&key=${process.env.YOUTUBE_API_KEY}&maxResults=50&order=relevance&textFormat=plainText`
		);

		if (!commentsThreads.ok) {
			throw new Error("Failed to fetch from YouTube API");
		}

		const { data: video_id } = await supabase
			.from("videos")
			.select("id")
			.eq("youtube_id", id);

		const commentThreadsJson = await commentsThreads.json();

		const comments: Comment[] = commentThreadsJson.items.map(
			(item: any): Comment => ({
				id: randomUUID(),
				youtube_comment_id: item.id,
				video_id: video_id && video_id.length > 0 ? video_id[0].id : null,
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
				category: "Unmatched",
			})
		);

		return NextResponse.json(comments ?? []);
	} catch (error) {
		console.error("Error fetching comments:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch comments",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
