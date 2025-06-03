"use server"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function signInWithGoogle() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: 'http://localhost:3000/auth/callback',
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
            scopes: "https://www.googleapis.com/auth/youtube.readonly"
        },
    })
    if (data.url) {
        redirect(data.url)
    }
}
async function getChannelDetails() {
    const supabase = await createClient();
    const session = supabase.auth.getSession();
    const token = (await session).data.session?.provider_token
    try {
        const data = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&mine=true&key=${process.env.YOUTUBE_API_KEY}`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        const response = await data.json();
        console.log(response)
        return NextResponse.json(response)
    } catch (error) {
        console.error("Error fetching channelId:", error)
        return NextResponse.json(
            {
                error: "Error fetching channelId",
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

export async function upsertUser(user: {
    id: string
    email: string
    name: string
    avatar_url: string
    created_at: string
}) {
    const supabase = await createClient()
    const data = await getChannelDetails();
    const response = await data?.json()
    const upload_playlist_id = response.items[0].id
    const name = response.items[0].snippet.title
    const { error } = await supabase
        .from('users')
        .upsert({
            id: user.id,
            email: user.email,
            name: name,
            avatar_url: user.avatar_url,
            created_at: user.created_at,
            upload_playlist_id: upload_playlist_id
        })

    if (error) {
        console.error('Error upserting user:', error)
        throw error
    }
}