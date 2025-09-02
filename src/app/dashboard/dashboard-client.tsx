"use client";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import VideosGrid from "@/components/dashboard/videos-grid";

import { Suspense, useState } from "react";
import { Loader2 } from "lucide-react";

import { Video } from "@/types/db/video";

interface DashboardClientProps {
	initialVideos: {
		videos: Video[];
		reauth: boolean;
	};
}

export default function DashboardClient({ initialVideos }: DashboardClientProps) {
	const [videoCount, setVideoCount] = useState(initialVideos.videos.length);

	return (
		<>
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
					{videoCount}
				</Badge>
			</header>
			{/* Main Content */}
			<main className="flex-1 p-8 pt-0">
				<Suspense
					fallback={
						<div className="flex justify-center items-center h-full">
							<Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
						</div>
					}
				>
					<VideosGrid 
						initialVideos={initialVideos} 
						onVideoCountChange={setVideoCount} 
					/>
				</Suspense>
			</main>
		</>
	);
}