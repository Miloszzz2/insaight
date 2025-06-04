"use server";
import { Video } from "@/types/db/video";

import { createClient } from "@/utils/supabase/server";

import { randomUUID } from "crypto";

export async function fetchVideos({
	refetchFromApi = false,
}: { refetchFromApi?: boolean } = {}) {
	const supabase = await createClient();
	const session = supabase.auth.getSession();
	const token = (await session).data.session?.provider_token;
	const userId = (await supabase.auth.getUser()).data.user?.id;
	const { data } = await supabase
		.from("users")
		.select("upload_playlist_id")
		.eq("id", userId);
	const uploadPlaylistId = data && data[0]?.upload_playlist_id;

	if (!userId) return [];

	try {
		if (refetchFromApi && uploadPlaylistId) {
			// Fetch from YouTube API and upsert to DB
			const videosData = await fetch(
				`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&myRating=like&key=${process.env.YOUTUBE_API_KEY}`,
				{
					headers: {
						Authorization: "Bearer " + token,
					},
				}
			);

			const videoInfo = await videosData.json();
			if (videoInfo.items) {
				const videos_to_upload = videoInfo.items.map((item: any) => {
					const video: Video = {
						id: randomUUID(),
						youtube_id: item.id,
						title: item.snippet.title,
						thumbnail_url: item.snippet.thumbnails.high.url,
						user_id: userId,
						published_at: new Date(
							item.snippet.publishedAt
						).toLocaleString(),
						created_at: new Date()
							.toISOString()
							.replace("T", " ")
							.replace("Z", ""),
						duration: item.contentDetails.duration,
						views: item.statistics.viewCount,
						comment_count: item.statistics.commentCount,
						like_count: item.statistics.likeCount,
					};
					return video;
				});

				// TODO add error handle here
				await supabase.from("videos").upsert(videos_to_upload, {
					onConflict: "youtube_id",
					ignoreDuplicates: true,
				});
			}
		}
		// Always fetch from DB after possible upsert
		const { data: videos, error: selectVideosError } = await supabase
			.from("videos")
			.select()
			.eq("user_id", userId);

		// TODO add error handle here
		if (selectVideosError) throw selectVideosError;

		return videos ?? [];
	} catch (error) {
		console.error("Error fetching videos:", error);
		return [];
	}
}
