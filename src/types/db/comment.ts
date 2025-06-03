export type Comment = {
   id: string;
   youtube_comment_id: string;
   video_id: string;
   author_name: string;
   text: string;
   sentiment: "positive" | "negative" | "neutral";
   created_at: string;
   avatar: string;
   likes: number;
   category: string;
};