"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import Link from "next/link";
import { use, useState, useTransition } from "react";

import { Eye, Calendar, RefreshCw } from "lucide-react";

import { Video } from "@/types/db/video";
import { parseISODuration } from "@/utils/dashboard/parse-iso-duration";
import { fetchVideos } from "@/app/dashboard/actions/fetch-videos";
import { VideoSkeleton } from "./video-skeleton";

export default function VideosGrid({ videos }: { videos: Promise<Video[]> }) {
	const [allVideos, setAllVideos] = useState(use(videos));
	const [isPending, startTransition] = useTransition();

	if (!allVideos) return "No Videos";

	const handleRefresh = () => {
		startTransition(async () => {
			const result = await fetchVideos({ refetchFromApi: true });
			if (result.length > 0) {
				setAllVideos(result);
			}
		});
	};

	const skeletons = Array(allVideos.length)
		.fill(0)
		.map((_, i) => <VideoSkeleton key={`skeleton-${i}`} />);

	return (
		<div className="space-y-2 py-2 flex flex-col">
			<div className="self-end">
				<Button
					onClick={handleRefresh}
					disabled={isPending}
					className="relative"
				>
					<span className="flex items-center gap-2">
						Refresh{" "}
						<RefreshCw className={isPending ? "animate-spin" : ""} />
					</span>
				</Button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{isPending ? (
					skeletons
				) : allVideos.length > 0 ? (
					allVideos.map((video: Video) => (
						<Card
							key={video.id}
							className="bg-white hover:shadow-lg transition-shadow duration-200 group py-0"
						>
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
										<div className="text-sm text-gray-600">
											{video.comment_count} comments
										</div>
										<Link href={`/analysis/${video.youtube_id}`}>
											<Button
												className="bg-violet-600 hover:bg-violet-700 text-white"
												size="sm"
											>
												Analyze
											</Button>
										</Link>
									</div>
								</div>
							</CardContent>
						</Card>
					))
				) : (
					<div className="col-span-full text-center py-8 text-gray-500">
						No videos found
					</div>
				)}
			</div>
		</div>
	);
}
