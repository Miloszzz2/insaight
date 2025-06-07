import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function VideoSkeleton() {
	return (
		<Card className="bg-white py-0">
			<CardContent className="p-0">
				{/* Thumbnail Skeleton */}
				<Skeleton className="w-full h-[288px] rounded-t-lg" />

				{/* Content */}
				<div className="p-4">
					{/* Title Skeleton */}
					<Skeleton className="h-6 w-[80%] mb-2" />
					<Skeleton className="h-4 w-[60%] mb-2" />

					{/* Stats Skeleton */}
					<div className="flex items-center space-x-4 mb-4">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-24" />
					</div>

					{/* Bottom Section */}
					<div className="flex items-center justify-between">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-9 w-20" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
