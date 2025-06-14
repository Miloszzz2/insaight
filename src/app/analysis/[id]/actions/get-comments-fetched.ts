"use server";
import { createClient } from "@/utils/supabase/server";

export async function getCommentsFetched(id: string): Promise<boolean> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("videos")
		.select("comments_fetched")
		.eq("youtube_id", id)
		.limit(1)
		.single();

	if (error) {
		console.error("Error fetching comments_fetched:", error);
		return false;
	}

	return data?.comments_fetched || false;
}
