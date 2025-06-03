'use client'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Eye, Calendar } from "lucide-react"
import { Video } from "@/types/db/video"
import { use } from "react"
import { parseISODuration } from "@/utils/dashboard/parse-iso-duration"
import { DateToLocale } from "@/utils/dashboard/date-tolocale"

export default function VideosGrid({
   videos,
}: {
   videos: Promise<Video[]>
}) {
   const allVideos = use(videos)
   if (!allVideos)
      return "No Videos"
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {allVideos.length > 0 ?
            allVideos.map((video: Video) => (
               <Card key={video.id} className="bg-white hover:shadow-lg transition-shadow duration-200 group py-0">
                  <CardContent className="p-0">
                     {/* Thumbnail */}
                     <div className="relative">
                        <Image
                           src={video.thumbnail_url || ""}
                           alt={video.title}
                           width={300}
                           height={288}
                           quality={100}
                           className="w-full max-h-72 object-cover rounded-t-lg"
                        />
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                           {parseISODuration(video.duration)}
                        </div>
                     </div>

                     {/* Content */}
                     <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors">
                           {video.title}
                        </h3>

                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                           <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{video.views} views</span>
                           </div>
                           <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{video.created_at}</span>
                           </div>
                        </div>

                        <div className="flex items-center justify-between">
                           <div className="text-sm text-gray-600">{video.comment_count} comments</div>
                           <Link href={`/analysis/${video.youtube_id}`}>
                              <Button className="bg-violet-600 hover:bg-violet-700 text-white" size="sm">
                                 Analyze
                              </Button>
                           </Link>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            )) : <h1>No videos</h1>}
      </div>
   )
}