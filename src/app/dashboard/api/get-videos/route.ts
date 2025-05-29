import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server"
export async function GET(request: Request) {
    const supabase = await createClient();
    const session = supabase.auth.getSession()
    const token = (await session).data.session?.provider_token

    const data = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    const res = await data.json();
    const upload_id = res.items[0].contentDetails.relatedPlaylists.uploads
    const data2 = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${upload_id}&maxResults=10`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    const video_info = await data2.json();
    return NextResponse.json(video_info)
}