"use server";

import { createClient } from "@/utils/supabase/server";

export async function getCategoryName(category_id: string): Promise<string> {
	const supabase = await createClient();
	//TODO handle this error

	const { data, error } = await supabase
		.from("comment_groups")
		.select()
		.eq("id", category_id)
		.limit(1)
		.single();

	if (error) {
		console.error("Error fetching category name:", error);
		return "";
	}

	return data?.name || "";
}
