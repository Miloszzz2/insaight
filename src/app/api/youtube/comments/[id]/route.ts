import { Comment } from "@/types/db/comment";
import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   try {
      const { id } = await params;

      const supabase = await createClient();

      // Fetch from YouTube Data API
      const response = await fetch(
         `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${id}&key=${process.env.YOUTUBE_API_KEY}&maxResults=50&order=relevance&textFormat=plainText`
      );

      if (!response.ok) {
         throw new Error("Failed to fetch from YouTube API");
      }

      const { data: video_id } = await supabase.from("videos").select("id").eq("youtube_id", id)
      const data = await response.json();
      const comments: Comment[] = data.items.map((item: any): Comment => ({
         id: randomUUID(),
         youtube_comment_id: item.id,
         video_id: video_id && video_id.length > 0 ? video_id[0].id : null,
         author_name: item.snippet.topLevelComment.snippet.authorDisplayName,
         text: item.snippet.topLevelComment.snippet.textDisplay,
         sentiment: "neutral",
         created_at: new Date(item.snippet.topLevelComment.snippet.publishedAt).toISOString().replace('T', ' ').replace('Z', ''),
         avatar: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
         likes: item.snippet.topLevelComment.snippet.likeCount,
         category: "Unmatched"
      }));

      return NextResponse.json(comments ?? []);
   } catch (error) {
      console.error("Error fetching comments:", error);
      return NextResponse.json(
         { error: "Failed to fetch comments", details: error instanceof Error ? error.message : String(error) },
         { status: 500 }
      );
   }
}
