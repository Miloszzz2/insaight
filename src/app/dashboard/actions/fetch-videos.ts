"use server";
import { Video } from "@/types/db/video";
import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";

export async function fetchVideos({
	refetchFromApi = false,
}: {
	refetchFromApi?: boolean;
} = {}): Promise<{ videos: Video[]; reauth: boolean }> {
	try {
		const supabase = await createClient();
		const session = supabase.auth.getSession();
		const token = (await session).data.session?.provider_token;
		const userId = (await supabase.auth.getUser()).data.user?.id;

		if (!userId) {
			return { videos: [], reauth: true };
		}

		const { error: userError } = await supabase
			.from("users")
			.select("upload_playlist_id")
			.eq("id", userId);

		if (userError) {
			// Log error only in development
			if (process.env.NODE_ENV === 'development') {
				console.error("Error fetching user data:", userError);
			}
			return { videos: [], reauth: false };
		}

		//const uploadPlaylistId = userData && userData[0]?.upload_playlist_id;

		if (refetchFromApi) {
			if (!token) {
				return { videos: [], reauth: true };
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
					let errorData;
					try {
						errorData = await videosResponse.json();
					} catch {
						errorData = { error: { message: "Invalid response from YouTube API" } };
					}
					
					// Log error only in development
					if (process.env.NODE_ENV === 'development') {
						console.error("YouTube API error:", errorData);
					}
					return { videos: [], reauth: false };
				}

				const videoInfo = await videosResponse.json();

				if (!videoInfo.items?.length) {
					return { videos: [], reauth: false };
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
					// Log error only in development
					if (process.env.NODE_ENV === 'development') {
						console.error("Error upserting videos:", upsertError);
					}
					return { videos: [], reauth: false };
				}
			} catch (apiError) {
				// Log error only in development
				if (process.env.NODE_ENV === 'development') {
					console.error("Error in YouTube API call:", apiError);
				}
				return { videos: [], reauth: false };
			}
		}

		// Always fetch from DB after possible upsert
		const { data: videos, error: selectVideosError } = await supabase
			.from("videos")
			.select()
			.eq("user_id", userId);

		if (selectVideosError) {
			// Log error only in development
			if (process.env.NODE_ENV === 'development') {
				console.error("Error fetching saved videos:", selectVideosError);
			}
			return { videos: [], reauth: false };
		}
		return { videos: videos ?? [], reauth: false };
	} catch (error: any) {
		if (error?.message?.includes("Reauthentication is required")) {
			return { videos: [], reauth: true };
		}
		// Log error only in development
		if (process.env.NODE_ENV === 'development') {
			console.error("Unexpected error in fetchVideos:", error);
		}
		return { videos: [], reauth: false };
	}
}
