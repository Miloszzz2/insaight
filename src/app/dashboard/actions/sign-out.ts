"use server";
import { createClient } from "@/utils/supabase/server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { toast } from "sonner";

export default async function signOut() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		const { error: signOutError } = await supabase.auth.signOut();
		if (signOutError) {
			// Log error only in development
			if (process.env.NODE_ENV === 'development') {
				console.log(signOutError);
			}
			toast.error("Sign out failed");
			redirect("/auth");
		}
	}
	revalidatePath("/", "layout");
	redirect("/auth");
}
