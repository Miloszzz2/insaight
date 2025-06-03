import { Comment } from "@/types/db/comment"

export async function analyzeSentiment(comments: Comment[]) {
   const response = await fetch("/api/ai/sentiment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comments, includeStats: true }),
   })
   if (!response.ok) throw new Error("Failed to analyze sentiment")
   return response.json()
}