import { Video } from "@/types/db/video";
import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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
			console.error("Error fetching user data:", userError);
			return NextResponse.json(
				{
					error: "Failed to fetch user data",
					details: userError.message,
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
			const errorData = await videosResponse.json();
			console.error("YouTube API error:", errorData);
			return NextResponse.json(
				{
					error: "Failed to fetch videos from YouTube",
					details: errorData.error?.message || "YouTube API error",
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
			console.error("Error upserting videos:", upsertVideosError);
			return NextResponse.json(
				{
					error: "Failed to save videos to database",
					details: upsertVideosError.message,
				},
				{ status: 500 }
			);
		}

		const { data: videos, error: selectVideosError } = await supabase
			.from("videos")
			.select()
			.eq("user_id", userId);

		if (selectVideosError) {
			console.error("Error fetching saved videos:", selectVideosError);
			return NextResponse.json(
				{
					error: "Failed to fetch saved videos",
					details: selectVideosError.message,
				},
				{ status: 500 }
			);
		}

		return NextResponse.json(videos || []);
	} catch (error) {
		console.error("Unexpected error in get-videos:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
