import { Video } from "@/types/db/video";

import { createClient } from "@/utils/supabase/server";

import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const supabase = await createClient();
	const session = supabase.auth.getSession();
	const token = (await session).data.session?.provider_token;
	const userId = (await supabase.auth.getUser()).data.user?.id as string;

	const { data: userData } = await supabase
		.from("users")
		.select("upload_playlist_id")
		.eq("id", userId);

	const uploadPLaylistId = userData && userData[0]?.upload_playlist_id;

	if (uploadPLaylistId && userId) {
		try {
			const videosData = await fetch(
				`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&myRating=like&key=${process.env.YOUTUBE_API_KEY}`,
				{
					headers: {
						Authorization: "Bearer " + token,
					},
				}
			);
			const videoInfo = await videosData.json();
			const videosToUpload = videoInfo.items.map((item: any) => {
				const video: Video = {
					id: randomUUID(),
					youtube_id: item.id,
					title: item.snippet.title,
					thumbnail_url: item.snippet.thumbnails.high.url,
					user_id: userId,
					published_at: item.snippet.publishedAt,
					created_at: new Date()
						.toISOString()
						.replace("T", " ")
						.replace("Z", ""),
					duration: item.contentDetails.duration,
					views: item.statistics.viewCount,
					comment_count: item.statistics.commentCount,
					like_count: item.statistics.likeCount,
					comments_fetched: false,
				};
				return video;
			});

			const { error: upsertVideosError } = await supabase
				.from("videos")
				.upsert(videosToUpload, {
					onConflict: "youtube_id",
					ignoreDuplicates: true,
				});

			//TODO better error handle here
			if (upsertVideosError) throw upsertVideosError;

			const { data, error: selectVideosError } = await supabase
				.from("videos")
				.select()
				.eq("user_id", userId);

			// TODO better error handle here
			if (selectVideosError) throw selectVideosError;

			return NextResponse.json(data);
		} catch (error) {
			console.error("Error fetching videos:", error);
			return NextResponse.json(
				{
					error: "Error fetching vidoes",
					details:
						error instanceof Error ? error.message : "Unknown error",
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
}
