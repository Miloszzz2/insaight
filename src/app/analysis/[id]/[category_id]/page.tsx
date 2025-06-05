import { getCommentsFromGroup } from "./actions/get-comments";
import { getCategoryName } from "./actions/get-category-name";
import Comments from "@/components/analysis/comments";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default async function Page({
	params,
}: {
	params: Promise<{ category_id: string }>;
}) {
	const { category_id } = await params;
	console.log(category_id);
	const comments = getCommentsFromGroup(category_id);
	const category_name = getCategoryName(category_id);
	return (
		<>
			<main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
				<Suspense
					fallback={
						<div className="flex justify-center items-center h-full">
							<Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
						</div>
					}
				>
					<Comments category_name={category_name} comments={comments} />
				</Suspense>
			</main>
		</>
	);
}
