import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Search,
  Film,
  Lightbulb,
  Mic,
  Music,
  MessageCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"

function AnalysisSidebar() {
  const categories = [
    { id: "editing", name: "Montage / Editing", icon: Film, count: 45, active: true },
    { id: "suggestions", name: "Future Video Ideas", icon: Lightbulb, count: 32, active: false },
    { id: "host", name: "Host Feedback", icon: Mic, count: 28, active: false },
    { id: "sound", name: "Sound / Music", icon: Music, count: 19, active: false },
    { id: "general", name: "General Impressions", icon: MessageCircle, count: 110, active: false },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-2">
          <h2 className="text-lg font-semibold text-gray-900">Comment Categories</h2>
          <p className="text-sm text-gray-600 mt-1">Click to filter comments</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <SidebarMenuItem key={category.id}>
                    <SidebarMenuButton isActive={category.active}>
                      <IconComponent className="w-4 h-4" />
                      <span>{category.name}</span>
                      <Badge
                        variant="secondary"
                        className={`ml-auto ${category.active ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {category.count}
                      </Badge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-2 py-2">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium text-gray-900">Sarah Chen</div>
              <div className="text-xs text-gray-600">@sarahcreates</div>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function AnalysisPage({ params }: { params: { id: string } }) {
  const comments = [
    {
      id: 1,
      author: "TechReviewer99",
      avatar: "/placeholder.svg?height=32&width=32",
      content:
        "The editing in this video is absolutely phenomenal! The transitions between scenes are so smooth and professional. You've really stepped up your game!",
      sentiment: "positive",
      likes: 24,
      timeAgo: "2 hours ago",
    },
    {
      id: 2,
      author: "CreativeMinds",
      avatar: "/placeholder.svg?height=32&width=32",
      content:
        "Love the quick cuts during the tutorial section. Makes it easy to follow along. The color grading also looks amazing!",
      sentiment: "positive",
      likes: 18,
      timeAgo: "4 hours ago",
    },
    {
      id: 3,
      author: "VideoEnthusiast",
      avatar: "/placeholder.svg?height=32&width=32",
      content:
        "The pacing feels a bit rushed in some parts. Maybe slow down the editing during the explanation segments?",
      sentiment: "neutral",
      likes: 12,
      timeAgo: "6 hours ago",
    },
    {
      id: 4,
      author: "FilmStudent2024",
      avatar: "/placeholder.svg?height=32&width=32",
      content:
        "Your B-roll footage selection is perfect! Really adds to the storytelling. The jump cuts work well too.",
      sentiment: "positive",
      likes: 31,
      timeAgo: "8 hours ago",
    },
    {
      id: 5,
      author: "EditingPro",
      avatar: "/placeholder.svg?height=32&width=32",
      content: "Some of the transitions feel a bit jarring. Consider using smoother fades between certain scenes.",
      sentiment: "negative",
      likes: 7,
      timeAgo: "10 hours ago",
    },
  ]

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="w-4 h-4 text-green-500" />
      case "negative":
        return <ThumbsDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "border-l-green-500 bg-green-50"
      case "negative":
        return "border-l-red-500 bg-red-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  return (
    <SidebarProvider>
      <AnalysisSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-auto min-h-16 shrink-0 items-center gap-2 border-b px-4 py-4 ">
          <SidebarTrigger />
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-violet-600 self-start">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Videos
              </Button>
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                How to Create Amazing YouTube Thumbnails in 2024
              </h1>
              <p className="text-sm text-gray-600">Analyzing 234 comments • Montage / Editing category</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Sentiment Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
                  <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  <span>Positive</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-green-600 mb-2">78%</div>
                <Progress value={78} className="h-2 bg-green-100" />
                <p className="text-sm text-gray-600 mt-2">35 comments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
                  <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  <span>Neutral</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-gray-600 mb-2">15%</div>
                <Progress value={15} className="h-2 bg-gray-100" />
                <p className="text-sm text-gray-600 mt-2">7 comments</p>
              </CardContent>
            </Card>

            <Card className="sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
                  <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                  <span>Negative</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-red-600 mb-2">7%</div>
                <Progress value={7} className="h-2 bg-red-100" />
                <p className="text-sm text-gray-600 mt-2">3 comments</p>
              </CardContent>
            </Card>
          </div>

          {/* AI Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
                <Film className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                <span>AI Summary - Montage / Editing</span>
              </CardTitle>
              <CardDescription>Key insights from your audience about editing and montage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                <p className="text-sm sm:text-base text-gray-700">
                  Your audience is overwhelmingly positive about your editing skills! They particularly love your smooth
                  transitions, professional color grading, and effective use of B-roll footage. Some viewers suggest
                  slowing down the pacing during explanation segments and using smoother fades between certain scenes.
                  Overall, your editing quality is seen as a major strength that sets your content apart.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Comments</CardTitle>
              <CardDescription>Showing {comments.length} comments in the Montage / Editing category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search comments..." className="pl-10" />
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`border-l-4 p-3 sm:p-4 rounded-lg ${getSentimentColor(comment.sentiment)}`}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{comment.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                          <span className="font-medium text-gray-900 truncate">{comment.author}</span>
                          <div className="flex items-center space-x-2">
                            {getSentimentIcon(comment.sentiment)}
                            <span className="text-sm text-gray-500">{comment.timeAgo}</span>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-gray-700 mb-2">{comment.content}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{comment.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
