"use server";
import { AnalysisData } from "@/types/analysis/analysis-data";
import { Comment } from "@/types/db/comment";
import { createClient } from "@/utils/supabase/server";

export default async function getAnalysisData(
	video_id: string
): Promise<AnalysisData> {
	try {
		const supabase = await createClient();
		const { data: commentsData, error: selectCommentsError } = await supabase
			.from("comments")
			.select()
			.eq("video_youtube_id", video_id);
		const { data: commentGroupsData, error: commentGroupsError } =
			await supabase
				.from("comment_groups")
				.select()
				.eq("video_youtube_id", video_id);

		const { data: analysisDataDb, error: analysisDayaError } = await supabase
			.from("analysis")
			.select()
			.eq("youtube_video_id", video_id)
			.single();
		if (commentsData && commentGroupsData && analysisDataDb) {
			const analysisData: AnalysisData = {
				comments: commentsData,
				categories: commentGroupsData,
				sentimentSummary: {
					positive: analysisDataDb?.positive_count || 0,
					negative: analysisDataDb?.negative_count || 0,
					neutral: analysisDataDb?.neutral_count || 0,
				},
				aiSummary: analysisDataDb?.summary || "",
			};
			console.log(analysisData.sentimentSummary);
			return analysisData;
		}
		throw new Error("Analysis data not found for the given video_id.");
	} catch (error) {
		throw new Error("Failed to fetch analysis data." + error);
	}
}
