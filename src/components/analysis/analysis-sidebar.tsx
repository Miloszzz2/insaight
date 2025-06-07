import { createClient } from "@/utils/supabase/server";
import getAnalysisData from "../../app/analysis/[id]/actions/get-analysis.data";
import { AnalysisSidebarClient } from "@/components/analysis/analysis-sidebar-client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
	Sidebar,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarFooter,
} from "@/components/ui/sidebar";
import signOut from "@/app/dashboard/actions/sign-out";
import { LogOut } from "lucide-react";

interface SidebarProps {
	videoId: string;
}

export async function AnalysisSidebar({ videoId }: SidebarProps) {
	const supabase = await createClient();

	// Get current user data from server
	const {
		data: { user: authUser },
	} = await supabase.auth.getUser();
	if (!authUser?.id) {
		throw new Error("User is not authenticated");
	}
	const { data: dbUser } = await supabase
		.from("users")
		.select()
		.eq("id", authUser.id)
		.limit(1)
		.single();

	const userData = {
		name: dbUser?.name,
		username: dbUser?.username,
		avatar_url: dbUser?.avatar_url,
	};

	// Get analysis data from server
	const analysisData = await getAnalysisData(videoId);

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="px-2 py-2">
					<h2 className="text-lg font-semibold text-gray-900">
						Comment Categories
					</h2>
				</div>
			</SidebarHeader>
			<AnalysisSidebarClient
				user={userData}
				analysisData={analysisData}
				isAnalyzed={analysisData.comments.length > 0}
			/>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild className="px-2 py-4 h-14">
								<SidebarMenuButton>
									<div className="flex items-center space-x-3">
										<Avatar className="w-10 h-10">
											<AvatarImage
												src={dbUser?.avatar_url as string}
											/>
											<AvatarFallback>SC</AvatarFallback>
										</Avatar>
										<div>
											<div className="font-medium text-gray-900">
												{dbUser?.name}
											</div>
											<div className="text-sm text-gray-600">
												{dbUser?.username}
											</div>
										</div>
									</div>
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent side="top" className="w-[230px]">
								<DropdownMenuItem className="w-full h-full">
									<form action={signOut} className="w-full">
										<SidebarMenuButton>
											<LogOut className="w-4 h-4" />
											<span className="font-semibold">Sign Out</span>
										</SidebarMenuButton>
									</form>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
