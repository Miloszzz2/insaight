import Analysis from "@/components/analysis/analysis-main";
import { getCommentsFetched } from "./actions/get-comments-fetched";
import AnalysisLoading from "@/components/analysis/analysis-loading";
import { AnalysisSidebar } from "../../../components/analysis/analysis-sidebar";

export default async function AnalysisPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const commentsFetched = await getCommentsFetched(id);
	return (
		<>
			<AnalysisSidebar videoId={id} />
			<main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
				{commentsFetched ? (
					<Analysis id={id} />
				) : (
					<AnalysisLoading id={id} />
				)}
			</main>
		</>
	);
}
