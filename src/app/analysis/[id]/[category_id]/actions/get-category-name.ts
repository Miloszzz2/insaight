"use server";

import { createClient } from "@/utils/supabase/server";

export async function getCategoryName(category_id: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("comment_groups")
		.select("name")
		.eq("id", category_id)
		.limit(1)
		.single();

	return data?.name;
}
