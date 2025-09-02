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
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
	const videos = await fetchVideos({ refetchFromApi: false });
	
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<DashboardClient initialVideos={videos} />
			</SidebarInset>
		</SidebarProvider>
	);
}
