import { Comment } from "@/types/db/comment";

export async function categorizeComments(comments: Comment[]) {
   const response = await fetch("/api/ai/categorize", {
      cache: 'force-cache',
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comments }),
   });

   if (!response.ok) {
      throw new Error("Failed to categorize comments");
   }

   const data = await response.json(); // Consume the response body once
   return data; // Return the parsed JSON data
}