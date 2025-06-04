import { Comment } from "@/types/db/comment";

export async function analyzeSentiment(comments: Comment[]) {
	const commentsWithSentiment = await fetch("/api/ai/sentiment", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ comments, includeStats: true }),
	});
	if (!commentsWithSentiment.ok)
		throw new Error("Failed to analyze sentiment");
	return commentsWithSentiment.json();
}
