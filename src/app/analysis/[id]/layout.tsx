import { AnalysisSidebar } from "@/components/analysis/analysis-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AnalysisHeader from "@/components/analysis/analysis-header";
import { AnalysisContextProvider } from "./context/analysis-context-provider";

export default async function AnalysisLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return (
		<AnalysisContextProvider>
			<SidebarProvider>
				<AnalysisSidebar videoId={id} />
				<SidebarInset>
					<AnalysisHeader />
					{children}
				</SidebarInset>
			</SidebarProvider>
		</AnalysisContextProvider>
	);
}
