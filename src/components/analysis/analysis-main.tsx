import getAnalysisData from "@/app/analysis/[id]/actions/get-analysis.data";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { ThumbsUp, ThumbsDown, Minus, Film } from "lucide-react";
import { CommentsList } from "./comments-list";

export default async function Analysis({ id }: { id: string }) {
	const analysisData = await getAnalysisData(id);
	return (
		<>
			<div className="space-y-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base sm:text-lg flex items-center space-x-2">
								<ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
								<span>Positive</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-xl sm:text-2xl font-bold text-green-600 mb-2">
								{Math.floor(
									(analysisData.sentimentSummary.positive /
										analysisData.comments.length) *
										100
								)}
								%
							</div>
							<Progress
								value={
									(analysisData.sentimentSummary.positive /
										analysisData.comments.length) *
									100
								}
								className="h-2 bg-green-100"
							/>
							<p className="text-sm text-gray-600 mt-2">
								{analysisData.sentimentSummary.positive} comments
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base sm:text-lg flex items-center space-x-2">
								<Minus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
								<span>Neutral</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-xl sm:text-2xl font-bold text-gray-600 mb-2">
								{Math.floor(
									(analysisData.sentimentSummary.neutral /
										analysisData.comments.length) *
										100
								)}
								%
							</div>
							<Progress
								value={
									(analysisData.sentimentSummary.neutral /
										analysisData.comments.length) *
									100
								}
								className="h-2 bg-gray-100"
							/>
							<p className="text-sm text-gray-600 mt-2">
								{analysisData.sentimentSummary.neutral} comments
							</p>
						</CardContent>
					</Card>

					<Card className="sm:col-span-2 lg:col-span-1">
						<CardHeader className="pb-3">
							<CardTitle className="text-base sm:text-lg flex items-center space-x-2">
								<ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
								<span>Negative</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-xl sm:text-2xl font-bold text-red-600 mb-2">
								{Math.floor(
									(analysisData.sentimentSummary.negative /
										analysisData.comments.length) *
										100
								)}
								%
							</div>
							<Progress
								value={
									(analysisData.sentimentSummary.negative /
										analysisData.comments.length) *
									100
								}
								className="h-2 bg-red-100"
							/>
							<p className="text-sm text-gray-600 mt-2">
								{analysisData.sentimentSummary.negative} comments
							</p>
						</CardContent>
					</Card>
				</div>

				{/* AI Summary */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base sm:text-lg flex items-center space-x-2">
							<Film className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
							<span>AI Summary - Montage / Editing</span>
						</CardTitle>
						<CardDescription>
							Key insights from your audience about editing and montage
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
							<p className="text-sm sm:text-base text-gray-700">
								{analysisData.aiSummary ||
									"AI summary will appear here after analysis..."}
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Comments List */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base sm:text-lg">
							Comments
						</CardTitle>
						<CardDescription>
							Showing {analysisData.comments.length} analyzed comments
						</CardDescription>
					</CardHeader>
					<CardContent>
						<CommentsList comments={analysisData.comments} />
					</CardContent>
				</Card>
			</div>
		</>
	);
}
