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
		const supabase = await createClient();
		const { numComments } = await request.json();

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
		console.log(allItems.length);
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
