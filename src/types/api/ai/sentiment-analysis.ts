export interface SentimentResult {
   sentiment: 'positive' | 'negative' | 'neutral';
   confidence: number;
   score: number;
   simpleScore: number;
   tokens: number;
   processedTokens: string[];
   error?: string;
}

export interface TextStatistics {
   characters: number;
   words: number;
   sentences: number;
   averageWordsPerSentence: number;
}

export interface CommentAnalysis extends SentimentResult {
   id: string;
   youtube_comment_id: string;
   video_id: string;
   author_name: string;
   text: string;
   originalSentiment: "positive" | "negative" | "neutral";
   created_at: string;
   avatar: string;
   likes: number;
   statistics?: TextStatistics;
   category: string;
}

export interface SentimentDistribution {
   positive: number;
   negative: number;
   neutral: number;
}

export interface AnalysisSummary {
   totalComments: number;
   sentimentDistribution: SentimentDistribution;
   averageConfidence: number;
   averageScore: number;
   analyzer: string;
   sentimentChanges: {
      total: number;
      improved: number;
      worsened: number;
      unchanged: number;
   };
}

export interface RequestBody {
   comments: Comment[];
   includeStats?: boolean;
}

export interface AnalyzedCommentsApiResponse {
   success: boolean;
   data?: {
      results: CommentAnalysis[];
      summary: AnalysisSummary;
   };
   error?: string;
   message?: string;
}

export interface ApiErrorResponse {
   error: string;
   message?: string;
}