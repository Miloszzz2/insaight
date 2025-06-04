import { Comment } from "@/types/db/comment";

export async function categorizeComments(comments: Comment[]) {
	const commentsCategorized = await fetch("/api/ai/categorize", {
		cache: "force-cache",
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ comments }),
	});

	if (!commentsCategorized.ok) {
		throw new Error("Failed to categorize comments");
	}

	const data = await commentsCategorized.json(); // Consume the response body once
	return data; // Return the parsed JSON data
}
