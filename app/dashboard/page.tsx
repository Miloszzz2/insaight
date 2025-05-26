import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Play, Eye, Calendar, BarChart3, LogOut } from "lucide-react"

function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center px-2 pt-3">
          <h1 className="text-xl font-bold text-violet-600">InsAight</h1>
        </div>
      </SidebarHeader>

      <SidebarContent>


        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <Play className="w-4 h-4" />
                  <span>My Videos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>User Profile</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 py-2">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-gray-900">Sarah Chen</div>
                  <div className="text-sm text-gray-600">@sarahcreates</div>
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarMenu className="px-3">
          <SidebarMenuItem>
            <Link href="/">
              <SidebarMenuButton>
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function DashboardPage() {
  const videos = [
    {
      id: "1",
      title: "How to Create Amazing YouTube Thumbnails in 2024",
      thumbnail: "/placeholder.svg?height=180&width=320",
      views: "45.2K",
      uploadDate: "2 days ago",
      commentCount: 234,
      duration: "12:34",
    },
    {
      id: "2",
      title: "My Complete Video Editing Workflow - Behind the Scenes",
      thumbnail: "/placeholder.svg?height=180&width=320",
      views: "28.7K",
      uploadDate: "1 week ago",
      commentCount: 156,
      duration: "18:45",
    },
    {
      id: "3",
      title: "Top 10 Content Creation Tools Every YouTuber Needs",
      thumbnail: "/placeholder.svg?height=180&width=320",
      views: "67.1K",
      uploadDate: "2 weeks ago",
      commentCount: 389,
      duration: "15:22",
    },
    {
      id: "4",
      title: "Building My Dream Studio Setup - Room Tour & Equipment",
      thumbnail: "/placeholder.svg?height=180&width=320",
      views: "92.3K",
      uploadDate: "3 weeks ago",
      commentCount: 512,
      duration: "20:15",
    },
    {
      id: "5",
      title: "Why I Almost Quit YouTube (And What Changed My Mind)",
      thumbnail: "/placeholder.svg?height=180&width=320",
      views: "156.8K",
      uploadDate: "1 month ago",
      commentCount: 1247,
      duration: "14:56",
    },
    {
      id: "6",
      title: "Beginner's Guide to YouTube Analytics - Grow Your Channel",
      thumbnail: "/placeholder.svg?height=180&width=320",
      views: "34.5K",
      uploadDate: "1 month ago",
      commentCount: 198,
      duration: "16:33",
    },
  ]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex shrink-0 items-center gap-2 border-b px-4 py-4">
          <SidebarTrigger className="-ml-1 mx-2" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Select a YouTube Video to Analyze</h1>
            <p className="text-sm text-gray-600">Choose a video to get AI-powered insights from your comments</p>
          </div>
          <Badge variant="secondary" className="bg-violet-100 text-violet-700">
            {videos.length} videos available
          </Badge>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card key={video.id} className="bg-white hover:shadow-lg transition-shadow duration-200 group">
                <CardContent className="p-0">
                  {/* Thumbnail */}
                  <div className="relative">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
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
                        <span>{video.uploadDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">{video.commentCount} comments</div>
                      <Link href={`/analysis/${video.id}`}>
                        <Button className="bg-violet-600 hover:bg-violet-700 text-white" size="sm">
                          Analyze
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
