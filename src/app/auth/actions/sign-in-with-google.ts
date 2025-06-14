"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: "http://localhost:3000/auth/callback",
			queryParams: {
				access_type: "offline",
				prompt: "consent",
			},
			scopes: "https://www.googleapis.com/auth/youtube.readonly",
		},
	});

	// Handle error
	if (error) {
		console.error("Google sign-in error:", error.message);
		throw new Error("Failed to sign in with Google: " + error.message);
	}

	if (data.url) {
		redirect(data.url);
	}
}
