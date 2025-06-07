import getAnalysisData from "@/app/analysis/[id]/actions/get-analysis.data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

import { getSentimentColor } from "@/utils/analysis/get-sentiment-color";
import { getSentimentIcon } from "@/utils/analysis/get-sentiment-icon";

import { ThumbsUp, ThumbsDown, Minus, Search, Film } from "lucide-react";

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
						<div className="mb-4">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<Input
									placeholder="Search comments..."
									className="pl-10"
								/>
							</div>
						</div>

						<div className="space-y-4">
							{analysisData.comments.map((comment) => (
								<div
									key={comment.id}
									className={`border-l-4 p-3 sm:p-4 rounded-lg ${getSentimentColor(
										comment.sentiment
									)}`}
								>
									<div className="flex items-start space-x-3">
										<Avatar className="w-8 h-8 flex-shrink-0">
											<AvatarImage src={comment.avatar} />
											<AvatarFallback>
												{comment.author_name[0] || "None"}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1 min-w-0">
											<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
												<span className="font-medium text-gray-900 truncate">
													{comment.author_name || "None"}
												</span>
												<div className="flex items-center space-x-2">
													{getSentimentIcon(comment.sentiment)}
													<span className="text-sm text-gray-500">
														{comment.created_at}
													</span>
												</div>
											</div>
											<p className="text-sm sm:text-base text-gray-700 mb-2">
												{comment.text}
											</p>
											<div className="flex items-center space-x-2 text-sm text-gray-500">
												<ThumbsUp className="w-3 h-3" />
												<span>{comment.likes}</span>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
