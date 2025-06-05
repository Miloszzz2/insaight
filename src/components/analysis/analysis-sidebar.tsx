"use client";
import {
	Sidebar,
	SidebarHeader,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { CommentGroup } from "@/types/db/comment-group";

import { DynamicIcon } from "@/utils/analysis/dynamic-icon";
import { createClient } from "@/utils/supabase/client";

import { Film, Lightbulb, Mic, Music, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useAnalysis } from "@/app/analysis/[id]/context/analysis-context-provider";
import { categoryConfig } from "@/utils/dashboard/category-config";

export function AnalysisSidebar() {
	const [user, setUser] = useState<{
		name: string | null | undefined;
		username: string | null | undefined;
		avatar_url: string | null | undefined;
	}>();
	const { isAnalyzed, analysisData } = useAnalysis();
	const supabase = createClient();
	const getProfile = useCallback(async () => {
		try {
			const authUser = (await supabase.auth.getUser()).data.user;
			if (!authUser?.id) {
				throw Error;
			}
			const { data: dbUser } = await supabase
				.from("users")
				.select()
				.eq("id", authUser?.id)
				.limit(1)
				.single();

			setUser({
				name: dbUser?.name,
				username: dbUser?.username,
				avatar_url: dbUser?.avatar_url,
			});
		} catch (error: any) {
			toast.error(error.toString());
		}
	}, [user]);

	useEffect(() => {
		getProfile();
	}, [user, getProfile]);

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="px-2 py-2">
					<h2 className="text-lg font-semibold text-gray-900">
						Comment Categories
					</h2>
				</div>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Categories</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{!isAnalyzed &&
								categoryConfig.map((category) => {
									const IconComponent = category.icon;
									return (
										<SidebarMenuItem key={category.id}>
											<SidebarMenuButton
												isActive={category.active && isAnalyzed}
												disabled={!isAnalyzed}
												className="h-12 flex justify-between items-center"
											>
												<div className="flex items-center gap-2">
													<IconComponent className="w-4 h-4" />
													<span
														className={
															!isAnalyzed ? "text-gray-400" : ""
														}
													>
														{category.name}
													</span>
												</div>
												<Badge
													variant="secondary"
													className={`ml-auto ${
														category.active && isAnalyzed
															? "bg-violet-100 text-violet-700"
															: "bg-gray-100 text-gray-600"
													}`}
												>
													{category.count}
												</Badge>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							{isAnalyzed &&
								analysisData.categories.map(
									(category: CommentGroup) => {
										return (
											<SidebarMenuItem key={category.name}>
												<Link
													href={`/analysis/${category.video_youtube_id}/${category.id}`}
												>
													<SidebarMenuButton
														disabled={!isAnalyzed}
														className="h-12 flex justify-between items-center"
													>
														<div className="flex items-center gap-2">
															<DynamicIcon
																name={category.icon}
																className="w-4 h-4 text-gray-600"
															/>
															<span
																className={
																	!isAnalyzed
																		? "text-gray-400"
																		: ""
																}
															>
																{category.name}
															</span>
														</div>
														<Badge
															variant="secondary"
															className={`ml-auto ${
																isAnalyzed
																	? "bg-violet-100 text-violet-700"
																	: "bg-gray-100 text-gray-600"
															}`}
														>
															{category.count}
														</Badge>
													</SidebarMenuButton>
												</Link>
											</SidebarMenuItem>
										);
									}
								)}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<div className="px-2 py-2">
					<div className="flex items-center space-x-3">
						<Avatar className="w-8 h-8">
							<AvatarImage src={user?.avatar_url as string} />
							<AvatarFallback>SC</AvatarFallback>
						</Avatar>
						<div>
							<div className="text-sm font-medium text-gray-900">
								{user?.name}
							</div>
							<div className="text-xs text-gray-600">
								{user?.username}
							</div>
						</div>
					</div>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
