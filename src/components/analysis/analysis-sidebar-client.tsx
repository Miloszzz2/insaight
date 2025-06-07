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

import { CommentGroup } from "@/types/db/comment-group";
import { DynamicIcon } from "@/utils/analysis/dynamic-icon";
import Link from "next/link";
import { categoryConfig } from "@/utils/dashboard/category-config";
import { AnalysisData } from "@/types/analysis/analysis-data";
import { MessageSquare } from "lucide-react";

interface AnalysisSidebarClientProps {
	user: {
		name: string | null | undefined;
		username: string | null | undefined;
		avatar_url: string | null | undefined;
	};
	analysisData: AnalysisData;
	isAnalyzed: boolean;
}

export function AnalysisSidebarClient({
	user,
	analysisData,
	isAnalyzed,
}: AnalysisSidebarClientProps) {
	return (
		<SidebarContent>
			<SidebarGroup>
				<SidebarGroupLabel>Categories</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem key={"all"}>
							<Link
								href={`/analysis/${analysisData.comments[0].video_youtube_id}`}
							>
								<SidebarMenuButton
									disabled={!isAnalyzed}
									className="h-12 flex justify-between items-center"
								>
									<div className="flex items-center gap-2">
										<MessageSquare className="w-4 h-4 text-gray-600" />
										<span
											className={!isAnalyzed ? "text-gray-400" : ""}
										>
											All Comments
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
										{analysisData.comments.length}
									</Badge>
								</SidebarMenuButton>
							</Link>
						</SidebarMenuItem>
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
							analysisData.categories.map((category: CommentGroup) => (
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
														!isAnalyzed ? "text-gray-400" : ""
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
							))}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
	);
}
