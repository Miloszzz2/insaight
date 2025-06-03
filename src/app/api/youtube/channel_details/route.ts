import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
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