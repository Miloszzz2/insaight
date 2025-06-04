"use server";

import { createClient } from "@/utils/supabase/server";

export async function getCommentsFromGroup(category_id: string) {
	const supabase = await createClient();
	const { data: comments, error: commentsSelectError } = await supabase
		.from("comments")
		.select()
		.eq("category_id", category_id);

	return comments;
}
