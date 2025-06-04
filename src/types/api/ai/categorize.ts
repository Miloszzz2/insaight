import { Comment } from "@/types/db/comment";
import { CommentGroup } from "@/types/db/comment-group";

export interface CategorizationResult {
	categories: CommentGroup[];
	comments: Comment[];
	overallSummary: {
		sentiment: {
			overall: number;
			positive: number;
			negative: number;
			neutral: number;
		};
		keyThemes: string[];
		engagement: {
			level: string;
			description: string;
		};
		mainTakeaways: string;
		recommendations: string;
	};
}
