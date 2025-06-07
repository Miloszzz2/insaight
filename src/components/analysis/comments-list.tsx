"use client";

import { useState } from "react";
import { Comment } from "@/types/db/comment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getSentimentColor } from "@/utils/analysis/get-sentiment-color";
import { getSentimentIcon } from "@/utils/analysis/get-sentiment-icon";
import { ThumbsUp, Search } from "lucide-react";

type CommentsListProps = {
	comments: Comment[];
};

export function CommentsList({ comments }: CommentsListProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedSentiment, setSelectedSentiment] = useState<
		"all" | "positive" | "negative" | "neutral"
	>("all");

	const filteredComments = comments.filter((comment) => {
		const matchesSearch = comment.text
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const matchesSentiment =
			selectedSentiment === "all" || comment.sentiment === selectedSentiment;
		return matchesSearch && matchesSentiment;
	});

	return (
		<div className="space-y-4">
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
					<Input
						placeholder="Search comments..."
						className="pl-10"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<Select
					value={selectedSentiment}
					onValueChange={(
						value: "all" | "positive" | "negative" | "neutral"
					) => setSelectedSentiment(value)}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Filter by sentiment" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Comments</SelectItem>
						<SelectItem value="positive">Positive</SelectItem>
						<SelectItem value="neutral">Neutral</SelectItem>
						<SelectItem value="negative">Negative</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{filteredComments.length > 0 ? (
				<div className="space-y-4">
					{filteredComments.map((comment) => (
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
										{comment.author_name?.[0] || "?"}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1 min-w-0">
									<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
										<span className="font-medium text-gray-900 truncate">
											{comment.author_name || "Anonymous"}
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
			) : (
				<div className="text-center py-8 text-gray-500">
					No comments match your search criteria.
				</div>
			)}
		</div>
	);
}
