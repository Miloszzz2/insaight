import { Badge } from "@/components/ui/badge";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard/dashboard-sidebar";
import VideosGrid from "@/components/dashboard/videos-grid";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { fetchVideos } from "./actions/fetch-videos";

export default async function DashboardPage() {
	const videos = fetchVideos({ refetchFromApi: false });
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				{/* Header */}
				<header className="flex shrink-0 items-center gap-2 border-b px-4 py-4">
					<SidebarTrigger className="-ml-1 mx-2" />
					<div className="flex-1">
						<h1 className="text-lg font-semibold">
							Select a YouTube Video to Analyze
						</h1>
						<p className="text-sm text-gray-600">
							Choose a video to get AI-powered insights from your
							comments
						</p>
					</div>
					<Badge
						variant="secondary"
						className="bg-violet-100 text-violet-700 text-sm"
					>
						{(await videos).videos.length}
					</Badge>
				</header>
				{/* Main Content */}
				<main className="flex-1 p-8 pt-0">
					<Suspense
						fallback={
							<div className="flex justify-center items-center h-full">
								{" "}
								<Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
							</div>
						}
					>
						<VideosGrid videos={videos} />
					</Suspense>
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
