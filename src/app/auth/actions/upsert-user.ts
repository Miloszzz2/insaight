"use server";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

async function getChannelDetails() {
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

export async function upsertUser(user: {
	id: string;
	email: string;
	avatar_url: string;
	created_at: string;
}) {
	const supabase = await createClient();
	const channelDetails = await getChannelDetails();
	const channelDetailsJson = await channelDetails?.json();
	const uploadPlaylistId = channelDetailsJson.items[0].id;
	const name = channelDetailsJson.items[0].snippet.title;
	const username = channelDetailsJson.items[0].snippet.customUrl;
	const { error: upsertUsersError } = await supabase.from("users").upsert({
		id: user.id,
		email: user.email,
		name: name,
		username: username,
		avatar_url: user.avatar_url,
		created_at: user.created_at,
		upload_playlist_id: uploadPlaylistId,
	});

	if (upsertUsersError) {
		// Log error only in development
		if (process.env.NODE_ENV === 'development') {
			console.error("Error upserting user:", upsertUsersError);
		}
		throw upsertUsersError;
	}
}
