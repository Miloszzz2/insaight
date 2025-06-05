export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					operationName?: string;
					query?: string;
					variables?: Json;
					extensions?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			analysis: {
				Row: {
					created_at: string | null;
					id: string;
					negative_count: number | null;
					neutral_count: number | null;
					positive_count: number | null;
					summary: string | null;
					video_id: string | null;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					negative_count?: number | null;
					neutral_count?: number | null;
					positive_count?: number | null;
					summary?: string | null;
					video_id?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					negative_count?: number | null;
					neutral_count?: number | null;
					positive_count?: number | null;
					summary?: string | null;
					video_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "analysis_video_id_fkey";
						columns: ["video_id"];
						isOneToOne: false;
						referencedRelation: "videos";
						referencedColumns: ["id"];
					}
				];
			};
			comment_groups: {
				Row: {
					count: number | null;
					created_at: string | null;
					description: string | null;
					icon: string | null;
					id: string;
					name: string;
					video_id: string | null;
					video_youtube_id: string | null;
				};
				Insert: {
					count?: number | null;
					created_at?: string | null;
					description?: string | null;
					icon?: string | null;
					id: string;
					name: string;
					video_id?: string | null;
					video_youtube_id?: string | null;
				};
				Update: {
					count?: number | null;
					created_at?: string | null;
					description?: string | null;
					icon?: string | null;
					id?: string;
					name?: string;
					video_id?: string | null;
					video_youtube_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "comment_groups_video_id_fkey";
						columns: ["video_id"];
						isOneToOne: false;
						referencedRelation: "videos";
						referencedColumns: ["id"];
					}
				];
			};
			comments: {
				Row: {
					author_name: string | null;
					avatar: string | null;
					category_id: string | null;
					created_at: string | null;
					id: string;
					likes: number | null;
					sentiment: string | null;
					text: string;
					video_id: string | null;
					video_youtube_id: string | null;
					youtube_comment_id: string;
				};
				Insert: {
					author_name?: string | null;
					avatar?: string | null;
					category_id?: string | null;
					created_at?: string | null;
					id?: string;
					likes?: number | null;
					sentiment?: string | null;
					text: string;
					video_id?: string | null;
					video_youtube_id?: string | null;
					youtube_comment_id: string;
				};
				Update: {
					author_name?: string | null;
					avatar?: string | null;
					category_id?: string | null;
					created_at?: string | null;
					id?: string;
					likes?: number | null;
					sentiment?: string | null;
					text?: string;
					video_id?: string | null;
					video_youtube_id?: string | null;
					youtube_comment_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "comments_category_id_fkey";
						columns: ["category_id"];
						isOneToOne: false;
						referencedRelation: "comment_groups";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "comments_video_id_fkey";
						columns: ["video_id"];
						isOneToOne: false;
						referencedRelation: "videos";
						referencedColumns: ["id"];
					}
				];
			};
			users: {
				Row: {
					avatar_url: string | null;
					created_at: string | null;
					email: string;
					id: string;
					name: string | null;
					upload_playlist_id: string | null;
					username: string | null;
				};
				Insert: {
					avatar_url?: string | null;
					created_at?: string | null;
					email: string;
					id?: string;
					name?: string | null;
					upload_playlist_id?: string | null;
					username?: string | null;
				};
				Update: {
					avatar_url?: string | null;
					created_at?: string | null;
					email?: string;
					id?: string;
					name?: string | null;
					upload_playlist_id?: string | null;
					username?: string | null;
				};
				Relationships: [];
			};
			videos: {
				Row: {
					comment_count: number | null;
					created_at: string | null;
					duration: string | null;
					id: string;
					like_count: number | null;
					published_at: string | null;
					thumbnail_url: string | null;
					title: string | null;
					user_id: string | null;
					views: number | null;
					youtube_id: string;
				};
				Insert: {
					comment_count?: number | null;
					created_at?: string | null;
					duration?: string | null;
					id?: string;
					like_count?: number | null;
					published_at?: string | null;
					thumbnail_url?: string | null;
					title?: string | null;
					user_id?: string | null;
					views?: number | null;
					youtube_id: string;
				};
				Update: {
					comment_count?: number | null;
					created_at?: string | null;
					duration?: string | null;
					id?: string;
					like_count?: number | null;
					published_at?: string | null;
					thumbnail_url?: string | null;
					title?: string | null;
					user_id?: string | null;
					views?: number | null;
					youtube_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "videos_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
			DefaultSchema["Views"])
	? (DefaultSchema["Tables"] &
			DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
	? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
	? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
	? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
	: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
	? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
	: never;

export const Constants = {
	graphql_public: {
		Enums: {},
	},
	public: {
		Enums: {},
	},
} as const;
