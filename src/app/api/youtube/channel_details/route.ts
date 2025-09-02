import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
	const supabase = await createClient();
	const session = supabase.auth.getSession();
	const token = (await session).data.session?.provider_token;

	try {
		const channelDetailsData = await fetch(
			`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&mine=true&key=${process.env.YOUTUBE_API_KEY}`,
			{
				headers: {
					Authorization: "Bearer " + token,
				},
			}
		);
		
		if (!channelDetailsData.ok) {
			let errorData;
			try {
				errorData = await channelDetailsData.json();
			} catch {
				errorData = { error: { message: "Invalid response from YouTube API" } };
			}
			
			// Log error only in development
			if (process.env.NODE_ENV === 'development') {
				console.error("YouTube API error:", errorData);
			}
			
			return NextResponse.json(
				{
					error: "Failed to fetch channel details",
					...(process.env.NODE_ENV === 'development' && {
						details: errorData.error?.message || "YouTube API error",
					}),
				},
				{ status: channelDetailsData.status }
			);
		}
		
		const channelDetails = await channelDetailsData.json();
		return NextResponse.json(channelDetails);
	} catch (error) {
		// Log error only in development
		if (process.env.NODE_ENV === 'development') {
			console.error("Error fetching channelId:", error);
		}
		return NextResponse.json(
			{
				error: "Error fetching channel details",
				...(process.env.NODE_ENV === 'development' && {
					details: error instanceof Error ? error.message : "Unknown error",
				}),
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
