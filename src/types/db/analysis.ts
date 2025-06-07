export type Analysis = {
	id?: string;
	youtube_video_id: string;
	summary: string;
	positive_count: number;
	neutral_count: number;
	negative_count: number;
	created_at: string;
};
