export interface CommentGroup extends Category {
	id: string;
	video_id: string;
	created_at: string;
}

export interface Category {
	name: string;
	description: string;
	count: number;
	icon: string;
}
