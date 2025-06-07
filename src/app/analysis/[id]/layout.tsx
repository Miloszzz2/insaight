import { AnalysisSidebar } from "@/components/analysis/analysis-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AnalysisHeader from "@/components/analysis/analysis-header";
import { AnalysisContextProvider } from "./context/analysis-context-provider";

export default async function AnalysisLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { id: string };
}) {
	return (
		<AnalysisContextProvider>
			<SidebarProvider>
				<AnalysisSidebar videoId={params.id} />
				<SidebarInset>
					<AnalysisHeader />
					{children}
				</SidebarInset>
			</SidebarProvider>
		</AnalysisContextProvider>
	);
}
