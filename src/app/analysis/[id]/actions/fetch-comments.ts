export async function fetchComments(videoId: string) {
	const commentsData = await fetch(`/api/youtube/comments/${videoId}`);
	if (!commentsData.ok) {
		const text = await commentsData.text();
		console.error("Error response:", text);
		throw new Error("Failed to fetch comments");
	}
	try {
		return await commentsData.json();
	} catch (error) {
		throw new Error("Invalid JSON response");
	}
}
