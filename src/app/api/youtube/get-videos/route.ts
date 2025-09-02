import { Video } from "@/types/db/video";
import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const supabase = await createClient();
		const session = supabase.auth.getSession();
		const token = (await session).data.session?.provider_token;
		const userId = (await supabase.auth.getUser()).data.user?.id;

		if (!userId) {
			return NextResponse.json(
				{ error: "Unauthorized: User not authenticated" },
				{ status: 401 }
			);
		}

		const { data: userData, error: userError } = await supabase
			.from("users")
			.select("upload_playlist_id")
			.eq("id", userId);

		if (userError) {
			// Log error only in development
			if (process.env.NODE_ENV === 'development') {
				console.error("Error fetching user data:", userError);
			}
			return NextResponse.json(
				{
					error: "Failed to fetch user data",
					...(process.env.NODE_ENV === 'development' && {
						details: userError.message,
					}),
				},
				{ status: 500 }
			);
		}

		const uploadPLaylistId = userData && userData[0]?.upload_playlist_id;

		if (!uploadPLaylistId) {
			return NextResponse.json(
				{ error: "Upload playlist ID not found for user" },
				{ status: 404 }
			);
		}

		if (!token) {
			return NextResponse.json(
				{ error: "YouTube API token not found" },
				{ status: 401 }
			);
		}

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
			
			return NextResponse.json(
				{
					error: "Failed to fetch videos from YouTube",
					// Sanitize error details for production
					...(process.env.NODE_ENV === 'development' && {
						details: errorData.error?.message || "YouTube API error",
					}),
				},
				{ status: videosResponse.status }
			);
		}

		const videoInfo = await videosResponse.json();

		if (!videoInfo.items?.length) {
			return NextResponse.json(
				{ message: "No videos found" },
				{ status: 200 }
			);
		}

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

		if (upsertVideosError) {
			// Log error only in development
			if (process.env.NODE_ENV === 'development') {
				console.error("Error upserting videos:", upsertVideosError);
			}
			return NextResponse.json(
				{
					error: "Failed to save videos to database",
					...(process.env.NODE_ENV === 'development' && {
						details: upsertVideosError.message,
					}),
				},
				{ status: 500 }
			);
		}

		const { data: videos, error: selectVideosError } = await supabase
			.from("videos")
			.select()
			.eq("user_id", userId);

		if (selectVideosError) {
			// Log error only in development
			if (process.env.NODE_ENV === 'development') {
				console.error("Error fetching saved videos:", selectVideosError);
			}
			return NextResponse.json(
				{
					error: "Failed to fetch saved videos",
					...(process.env.NODE_ENV === 'development' && {
						details: selectVideosError.message,
					}),
				},
				{ status: 500 }
			);
		}

		return NextResponse.json(videos || []);
	} catch (error) {
		// Log error only in development
		if (process.env.NODE_ENV === 'development') {
			console.error("Unexpected error in get-videos:", error);
		}
		return NextResponse.json(
			{
				error: "Internal server error",
				...(process.env.NODE_ENV === 'development' && {
					details: error instanceof Error ? error.message : "Unknown error",
				}),
			},
			{ status: 500 }
		);
	}
}
