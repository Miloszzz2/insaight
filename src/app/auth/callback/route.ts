import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";
import { upsertUser } from "../actions/upsert-user";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	// if "next" is in param, use it as the redirect URL
	let next = searchParams.get("next") ?? "/dashboard";
	if (!next.startsWith("/")) {
		// if "next" is not a relative URL, use the default
		next = "/";
	}

	if (code) {
		const supabase = await createClient();
		const {
			data: { user },
			error,
		} = await supabase.auth.exchangeCodeForSession(code);

		if (!error && user) {
			try {
				console.log(user.id);
				await upsertUser({
					id: user.id,
					email: user.email ?? "",
					name: user.user_metadata.display_name,
					avatar_url: user.user_metadata.avatar_url,
					created_at: user.created_at,
				});
			} catch (error) {
				console.error("Error saving user:", error);
			}

			const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
			const isLocalEnv = process.env.NODE_ENV === "development";

			if (isLocalEnv) {
				// we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
				return NextResponse.redirect(`${origin}${next}`);
			} else if (forwardedHost) {
				return NextResponse.redirect(`https://${forwardedHost}${next}`);
			} else {
				return NextResponse.redirect(`${origin}${next}`);
			}
		}
	}

	// return the user to an error page with instructions
	return NextResponse.redirect(`${origin}/auth`);
}
