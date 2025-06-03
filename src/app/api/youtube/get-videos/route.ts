import { Video } from "@/types/db/video";
import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server"
export async function GET(request: Request) {
    const supabase = await createClient();
    const session = supabase.auth.getSession()
    const token = (await session).data.session?.provider_token
    const user_id = (await supabase.auth.getUser()).data.user?.id
    const { data } = await supabase.from("users").select("upload_playlist_id").eq("id", user_id)
    const upload_playlist_id = data && data[0]?.upload_playlist_id;
    if (upload_playlist_id && user_id) {
        try {
            const data2 = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&myRating=like&key=${process.env.YOUTUBE_API_KEY}`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            const video_info = await data2.json();
            const videos_to_upload = video_info.items.map((item: any) => {
                const video: Video = {
                    id: randomUUID(),
                    youtube_id: item.id,
                    title: item.snippet.title,
                    thumbnail_url: item.snippet.thumbnails.high.url,
                    user_id: user_id,
                    published_at: item.snippet.publishedAt,
                    created_at: new Date().toISOString().replace('T', ' ').replace('Z', ''),
                    duration: item.contentDetails.duration,
                    views: item.statistics.viewCount,
                    comment_count: item.statistics.commentCount,
                    like_count: item.statistics.likeCount
                }
                return video
            })
            console.log(videos_to_upload)
            const { error } = await supabase.from("videos").upsert(videos_to_upload, { onConflict: "youtube_id", ignoreDuplicates: true });

            if (error)
                throw error

            const { data, error: error2 } = await supabase.from("videos").select().eq("user_id", user_id)

            if (error2)
                throw error
            return NextResponse.json(data)
        }
        catch (error) {
            console.error("Error fetching videos:", error)
            return NextResponse.json(
                {
                    error: "Error fetching vidoes",
                    details: error instanceof Error ? error.message : "Unknown error"
                },
                {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
        }
    }
}