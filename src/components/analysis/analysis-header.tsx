"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { useAnalysis } from "@/app/analysis/[id]/context/analysis-context-provider";

export default function AnalysisHeader() {
	const { isAnalyzed, analysisData } = useAnalysis();
	return (
		<header className="flex h-auto min-h-16 shrink-0 gap-2 border-b px-4 py-4 items-center">
			<SidebarTrigger />
			<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
				<Link href="/dashboard">
					<Button
						variant="ghost"
						size="sm"
						className="text-gray-600 hover:text-violet-600 self-start"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Videos
					</Button>
				</Link>
				<div className="min-w-0 flex-1">
					<h1 className="text-lg font-semibold text-gray-900 truncate">
						How to Create Amazing YouTube Thumbnails in 2024
					</h1>
					<p className="text-sm text-gray-600">
						{isAnalyzed
							? `Analyzed ${analysisData.comments.length} comments • Montage / Editing category`
							: `Ready to analyze comments with AI`}
					</p>
				</div>
			</div>
		</header>
	);
}
