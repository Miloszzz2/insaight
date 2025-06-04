"use client";
import { AnalysisSidebar } from "@/components/analysis/analysis-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { AnalysisContextProvider } from "./context/analysis-context-provider";
import AnalysisHeader from "@/components/analysis/analysis-header";

export default function AnalysisLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AnalysisContextProvider>
			<SidebarProvider>
				<AnalysisSidebar />
				<SidebarInset>
					<AnalysisHeader />
					{children}
				</SidebarInset>
			</SidebarProvider>
		</AnalysisContextProvider>
	);
}
