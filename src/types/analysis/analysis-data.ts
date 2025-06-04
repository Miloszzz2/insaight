import { Comment } from "../db/comment";
import { CommentGroup } from "../db/comment-group";

export interface AnalysisData {
	comments: Comment[];
	categories: CommentGroup[];
	sentimentSummary: {
		positive: number;
		neutral: number;
		negative: number;
	};
	aiSummary: string;
}
