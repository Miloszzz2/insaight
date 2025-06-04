import { getCommentsFromGroup } from "./actions/get-comments";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSentimentColor } from "@/utils/analysis/get-sentiment-color";
import { getSentimentIcon } from "@/utils/analysis/get-sentiment-icon";

import { Loader2, ThumbsUp } from "lucide-react";
import { getCategoryName } from "./actions/get-category-name";

export default async function Page({
	params,
}: {
	params: Promise<{ category_id: string }>;
}) {
	const { category_id } = await params;
	console.log(category_id);
	const comments = await getCommentsFromGroup(category_id);
	const category_name = await getCategoryName(category_id);
	return (
		<>
			<main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
				<div className="space-y-4">
					<h1 className="text-2xl font-bold">
						Comments About: {category_name} ({comments?.length})
					</h1>
					{comments ? (
						comments.map((comment) => (
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
						))
					) : (
						<div className="flex justify-center items-center h-full">
							{" "}
							<Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
						</div>
					)}
				</div>
			</main>
		</>
	);
}
