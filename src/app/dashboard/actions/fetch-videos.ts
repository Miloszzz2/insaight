"use server";
import { Video } from "@/types/db/video";
import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";
import { toast } from "sonner";

export async function fetchVideos({
	refetchFromApi = false,
}: {
	refetchFromApi?: boolean;
} = {}): Promise<Video[]> {
	try {
		const supabase = await createClient();
		const session = await supabase.auth.getSession();
		const token = session.data.session?.provider_token;
		const userId = (await supabase.auth.getUser()).data.user?.id;

		if (!userId) {
			return [];
		}

		const { error: userError } = await supabase
			.from("users")
			.select("upload_playlist_id")
			.eq("id", userId);

		if (userError) {
			console.error("Error fetching user data:", userError);
			return [];
		}

		//const uploadPlaylistId = userData && userData[0]?.upload_playlist_id;

		if (refetchFromApi) {
			if (!token) {
				toast.error("Reauth needed. Your auth token expired");
				return [];
			}

			try {
				const videosResponse = await fetch(
					`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&myRating=like&key=${process.env.YOUTUBE_API_KEY}`,
					{
						headers: {
							Authorization: "Bearer " + token,
						},
					}
				);

				if (!videosResponse.ok) {
					const errorData = await videosResponse.json();
					console.error("YouTube API error:", errorData);
					return [];
				}

				const videoInfo = await videosResponse.json();

				if (!videoInfo.items?.length) {
					return [];
				}

				const videos_to_upload = videoInfo.items.map((item: any) => ({
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
					comments_fetched: false,
				}));

				const { error: upsertError } = await supabase
					.from("videos")
					.upsert(videos_to_upload, {
						onConflict: "youtube_id",
						ignoreDuplicates: true,
					});

				if (upsertError) {
					console.error("Error upserting videos:", upsertError);
					return [];
				}
			} catch (apiError) {
				console.error("Error in YouTube API call:", apiError);
				return [];
			}
		}

		// Always fetch from DB after possible upsert
		const { data: videos, error: selectVideosError } = await supabase
			.from("videos")
			.select()
			.eq("user_id", userId);

		if (selectVideosError) {
			console.error("Error fetching saved videos:", selectVideosError);
			return [];
		}
		return videos;
	} catch (error) {
		console.error("Unexpected error in fetchVideos:", error);
		return [];
	}
}
