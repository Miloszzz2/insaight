"use client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSentimentColor } from "@/utils/analysis/get-sentiment-color";
import { getSentimentIcon } from "@/utils/analysis/get-sentiment-icon";

import { Loader2, ThumbsUp } from "lucide-react";
import { Comment } from "@/types/db/comment";
import { use, useState } from "react";
import { Input } from "@/components/ui/input";

export default function Comments({
	comments,
	category_name,
}: {
	comments: Promise<Comment[]>;
	category_name: Promise<string>;
}) {
	const allComments = use(comments);
	const categoryName = use(category_name);
	const [selectedCategory, setSelectedCategory] = useState<
		"all" | "neutral" | "negative" | "positive"
	>("all");
	const [search, setSearch] = useState("");

	const filteredComments = allComments
		? allComments
				.filter((comment: Comment) => {
					if (selectedCategory !== "all") {
						return comment.sentiment === selectedCategory;
					}
					return true;
				})
				.filter((comment: Comment) =>
					comment.text.toLowerCase().includes(search.toLowerCase())
				)
		: [];

	return (
		<div className="space-y-4">
			<div className="flex justify-between flex-col sm:flex-row gap-2">
				<h2 className="text-2xl font-semibold">
					Comments About: {categoryName} ({allComments?.length})
				</h2>
				<div className="flex gap-2">
					<Input
						type="text"
						placeholder="Search comments..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="max-w-xs"
					/>
					<Select
						onValueChange={(
							e: "all" | "neutral" | "negative" | "positive"
						) => setSelectedCategory(e)}
						value={selectedCategory}
					>
						<SelectTrigger>
							<SelectValue placeholder="all" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All </SelectItem>
							<SelectItem value="positive">Positive </SelectItem>
							<SelectItem value="neutral">Neutral</SelectItem>
							<SelectItem value="negative">Negative</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
			{allComments ? (
				filteredComments.length > 0 ? (
					filteredComments.map((comment: Comment) => (
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
					<div className="text-center text-gray-500 py-8">
						No comments found.
					</div>
				)
			) : (
				<div className="flex justify-center items-center h-full">
					{" "}
					<Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
				</div>
			)}
		</div>
	);
}
