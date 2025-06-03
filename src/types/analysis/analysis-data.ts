import { Comment } from "../db/comment"
import { Category } from "../db/comment-group"

export interface AnalysisData {
   comments: Comment[]
   categories: Category[]
   sentimentSummary: {
      positive: number
      neutral: number
      negative: number
   }
   aiSummary: string
}