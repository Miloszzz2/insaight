import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Play, BarChart3, LogOut } from "lucide-react";

import signOut from "@/app/dashboard/actions/sign-out";
import { createClient } from "@/utils/supabase/server";

export default async function AppSidebar() {
	const supabase = await createClient();
	const authUser = (await supabase.auth.getUser()).data.user;

	if (!authUser?.id) return;

	const { data: dbUser } = await supabase
		.from("users")
		.select()
		.eq("id", authUser?.id)
		.limit(1)
		.single();

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
