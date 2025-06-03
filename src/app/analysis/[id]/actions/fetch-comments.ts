export async function fetchComments(videoId: string) {
   const response = await fetch(`/api/youtube/comments/${videoId}?refetchFromApi=true`);
   if (!response.ok) {
      const text = await response.text();
      console.error("Error response:", text);
      throw new Error("Failed to fetch comments");
   }
   try {
      return await response.json();
   } catch (error) {
      throw new Error("Invalid JSON response");
   }
}