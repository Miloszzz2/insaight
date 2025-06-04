"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AnalysisSidebar } from "@/components/analysis/analysis-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
   SidebarInset,
   SidebarProvider,
   SidebarTrigger,
} from "@/components/ui/sidebar";

import { AnalysisData } from "@/types/analysis/analysis-data";
import { AnalyzedCommentsApiResponse } from "@/types/api/ai/sentiment-analysis";
import { CategorizationResult } from "@/types/api/ai/categorize";
import { Comment } from "@/types/db/comment";

import { analyzeSentiment } from "./actions/analyze-sentiment";
import { categorizeComments } from "./actions/categorize-comments";
import { fetchComments } from "./actions/fetch-comments";

import { getSentimentColor } from "@/utils/analysis/get-sentiment-color";
import { getSentimentIcon } from "@/utils/analysis/get-sentiment-icon";

import Link from "next/link";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
   ArrowLeft,
   ThumbsUp,
   ThumbsDown,
   Minus,
   Search,
   Film,
   Lightbulb,
   Play,
   Loader2,
   CheckCircle,
   Brain,
   AlertCircle,
} from "lucide-react";

export default function AnalysisPage() {
   const [isAnalyzed, setIsAnalyzed] = useState(false);
   const [isAnalyzing, setIsAnalyzing] = useState(false);
   const [analysisStep, setAnalysisStep] = useState(0);
   const [error, setError] = useState<string | null>(null);
   const [analysisData, setAnalysisData] = useState<AnalysisData>({
      comments: [],
      categories: [],
      sentimentSummary: { positive: 0, neutral: 0, negative: 0 },
      aiSummary: "",
   });

   const params = useParams();

   const id = params.id as string;

   const analysisSteps = [
      {
         label: "Fetching comments from YouTube",
         icon: Play,
         action: async () => {
            const comments = await fetchComments(id);
            setAnalysisData((prev) => ({ ...prev, comments }));
            return comments;
         },
      },
      {
         label: "Analyzing sentiment with AI",
         icon: Brain,
         action: async (comments: Comment[]) => {
            const analyzedComments: AnalyzedCommentsApiResponse =
               await analyzeSentiment(comments);

            setAnalysisData((prev) => ({
               ...prev,
               comments: analyzedComments.data?.results || [],
               sentimentSummary: analyzedComments.data?.summary
                  .sentimentDistribution || {
                  positive: 0,
                  neutral: 0,
                  negative: 0,
               },
            }));
            return analyzedComments.data?.results;
         },
      },
      {
         label: "Categorizing comments by topics and generating AI summary",
         icon: Film,
         action: async (comments: Comment[]) => {
            const categorizedData: CategorizationResult =
               await categorizeComments(comments);
            console.log(categorizedData);
            setAnalysisData((prev) => ({
               sentimentSummary: {
                  positive: categorizedData.overallSummary.sentiment.positive,
                  negative: categorizedData.overallSummary.sentiment.negative,
                  neutral: categorizedData.overallSummary.sentiment.neutral,
               },
               comments: categorizedData.comments,
               categories: categorizedData.categories,
               aiSummary: categorizedData.overallSummary?.mainTakeaways || " ",
            }));
            return categorizedData.comments;
         },
      },
   ];

   const startAnalysis = async () => {
      setIsAnalyzing(true);
      setAnalysisStep(0);
      setError(null);
      try {
         let currentData: any = null;
         for (let i = 0; i < analysisSteps.length; i++) {
            setAnalysisStep(i);
            try {
               // Execute the actual API call for this step
               currentData = await analysisSteps[i].action(currentData);
            } catch (stepError) {
               console.error(`Error in step ${i}:`, stepError);
               toast.error(`Failed at step: ${analysisSteps[i].label}`);
               throw new Error(`Failed at step: ${analysisSteps[i].label}`);
            }
         }
         setIsAnalyzing(false);
         setIsAnalyzed(true);
      } catch (err) {
         setError(err instanceof Error ? err.message : "Analysis failed");
         setIsAnalyzing(false);
      }
   };

   const retryAnalysis = () => {
      setError(null);
      startAnalysis();
   };

   return (
      <SidebarProvider>
         <AnalysisSidebar
            categories={analysisData.categories}
            isAnalyzed={isAnalyzed}
         />
         <SidebarInset>
            {/* Header */}
            <header className="flex h-auto min-h-16 shrink-0 gap-2 border-b px-4 py-4 items-center">
               <SidebarTrigger />
               <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
                  <Link href="/dashboard">
                     <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-violet-600 self-start"
                     >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Videos
                     </Button>
                  </Link>
                  <div className="min-w-0 flex-1">
                     <h1 className="text-lg font-semibold text-gray-900 truncate">
                        How to Create Amazing YouTube Thumbnails in 2024
                     </h1>
                     <p className="text-sm text-gray-600">
                        {isAnalyzed
                           ? `Analyzed ${analysisData.comments.length} comments • Montage / Editing category`
                           : `Ready to analyze comments with AI`}
                     </p>
                  </div>
               </div>
            </header>
            {/* Content */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
               {error && (
                  <Alert variant="destructive">
                     <AlertCircle className="h-4 w-4" />
                     <AlertDescription className="flex items-center justify-between">
                        <span>{error}</span>
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={retryAnalysis}
                        >
                           Retry
                        </Button>
                     </AlertDescription>
                  </Alert>
               )}

               {!isAnalyzed && !isAnalyzing && !error && (
                  /* Pre-Analysis State */
                  <div className="max-w-4xl mx-auto text-center space-y-8">
                     <div className="space-y-4">
                        <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto">
                           <Brain className="w-10 h-10 text-violet-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">
                           Ready to Analyze Your Comments
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                           Our AI will fetch and analyze comments from your
                           video, categorize them by topics, and provide
                           sentiment analysis to help you understand your
                           audience better.
                        </p>
                     </div>

                     <Card className="max-w-2xl mx-auto">
                        <CardHeader>
                           <CardTitle className="text-lg">
                              What you'll get:
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="flex items-center space-x-3">
                                 <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <ThumbsUp className="w-4 h-4 text-green-600" />
                                 </div>
                                 <span className="text-sm">
                                    Sentiment Analysis
                                 </span>
                              </div>
                              <div className="flex items-center space-x-3">
                                 <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                                    <Film className="w-4 h-4 text-violet-600" />
                                 </div>
                                 <span className="text-sm">
                                    Comment Categories
                                 </span>
                              </div>
                              <div className="flex items-center space-x-3">
                                 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Brain className="w-4 h-4 text-blue-600" />
                                 </div>
                                 <span className="text-sm">
                                    AI-Generated Summary
                                 </span>
                              </div>
                              <div className="flex items-center space-x-3">
                                 <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                    <Lightbulb className="w-4 h-4 text-orange-600" />
                                 </div>
                                 <span className="text-sm">
                                    Actionable Insights
                                 </span>
                              </div>
                           </div>
                        </CardContent>
                     </Card>

                     <Button
                        size="lg"
                        onClick={startAnalysis}
                        className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 text-lg"
                     >
                        <Brain className="w-5 h-5 mr-2" />
                        Start AI Analysis
                     </Button>
                  </div>
               )}

               {isAnalyzing && (
                  /* Analysis in Progress */
                  <div className="max-w-4xl mx-auto text-center space-y-8">
                     <div className="space-y-4">
                        <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto">
                           <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">
                           Analyzing Your Comments
                        </h2>
                        <p className="text-lg text-gray-600">
                           Our AI is processing your comments. This may take a
                           few minutes.
                        </p>
                     </div>

                     <Card className="max-w-2xl mx-auto">
                        <CardContent className="p-6">
                           <div className="space-y-4">
                              {analysisSteps.map((step, index) => {
                                 const IconComponent = step.icon;
                                 const isActive = index === analysisStep;
                                 const isCompleted = index < analysisStep;
                                 const isUpcoming = index > analysisStep;

                                 return (
                                    <div
                                       key={index}
                                       className="flex items-center space-x-3"
                                    >
                                       <div
                                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                             isCompleted
                                                ? "bg-green-100"
                                                : isActive
                                                ? "bg-violet-100"
                                                : "bg-gray-100"
                                          }`}
                                       >
                                          {isCompleted ? (
                                             <CheckCircle className="w-4 h-4 text-green-600" />
                                          ) : isActive ? (
                                             <Loader2 className="w-4 h-4 text-violet-600 animate-spin" />
                                          ) : (
                                             <IconComponent
                                                className={`w-4 h-4 ${
                                                   isUpcoming
                                                      ? "text-gray-400"
                                                      : "text-violet-600"
                                                }`}
                                             />
                                          )}
                                       </div>
                                       <span
                                          className={`text-sm ${
                                             isCompleted
                                                ? "text-green-600"
                                                : isActive
                                                ? "text-violet-600 font-medium"
                                                : "text-gray-400"
                                          }`}
                                       >
                                          {step.label}
                                       </span>
                                    </div>
                                 );
                              })}
                           </div>
                           <div className="mt-6">
                              <Progress
                                 value={
                                    (analysisStep /
                                       (analysisSteps.length - 1)) *
                                    100
                                 }
                                 className="h-2"
                              />
                           </div>
                        </CardContent>
                     </Card>
                  </div>
               )}

               {isAnalyzed && (
                  /* Analysis Complete - Show Results */
                  <>
                     {/* Sentiment Overview */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                        <Card>
                           <CardHeader className="pb-3">
                              <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
                                 <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                 <span>Positive</span>
                              </CardTitle>
                           </CardHeader>
                           <CardContent>
                              <div className="text-xl sm:text-2xl font-bold text-green-600 mb-2">
                                 {Math.round(
                                    (analysisData.sentimentSummary.positive /
                                       analysisData.comments.length) *
                                       100
                                 )}
                                 %
                              </div>
                              <Progress
                                 value={
                                    (analysisData.sentimentSummary.positive /
                                       analysisData.comments.length) *
                                    100
                                 }
                                 className="h-2 bg-green-100"
                              />
                              <p className="text-sm text-gray-600 mt-2">
                                 {analysisData.sentimentSummary.positive}{" "}
                                 comments
                              </p>
                           </CardContent>
                        </Card>

                        <Card>
                           <CardHeader className="pb-3">
                              <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
                                 <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                 <span>Neutral</span>
                              </CardTitle>
                           </CardHeader>
                           <CardContent>
                              <div className="text-xl sm:text-2xl font-bold text-gray-600 mb-2">
                                 {Math.round(
                                    (analysisData.sentimentSummary.neutral /
                                       analysisData.comments.length) *
                                       100
                                 )}
                                 %
                              </div>
                              <Progress
                                 value={
                                    (analysisData.sentimentSummary.neutral /
                                       analysisData.comments.length) *
                                    100
                                 }
                                 className="h-2 bg-gray-100"
                              />
                              <p className="text-sm text-gray-600 mt-2">
                                 {analysisData.sentimentSummary.neutral}{" "}
                                 comments
                              </p>
                           </CardContent>
                        </Card>

                        <Card className="sm:col-span-2 lg:col-span-1">
                           <CardHeader className="pb-3">
                              <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
                                 <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                                 <span>Negative</span>
                              </CardTitle>
                           </CardHeader>
                           <CardContent>
                              <div className="text-xl sm:text-2xl font-bold text-red-600 mb-2">
                                 {Math.round(
                                    (analysisData.sentimentSummary.negative /
                                       analysisData.comments.length) *
                                       100
                                 )}
                                 %
                              </div>
                              <Progress
                                 value={
                                    (analysisData.sentimentSummary.negative /
                                       analysisData.comments.length) *
                                    100
                                 }
                                 className="h-2 bg-red-100"
                              />
                              <p className="text-sm text-gray-600 mt-2">
                                 {analysisData.sentimentSummary.negative}{" "}
                                 comments
                              </p>
                           </CardContent>
                        </Card>
                     </div>

                     {/* AI Summary */}
                     <Card>
                        <CardHeader>
                           <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
                              <Film className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                              <span>AI Summary - Montage / Editing</span>
                           </CardTitle>
                           <CardDescription>
                              Key insights from your audience about editing and
                              montage
                           </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                              <p className="text-sm sm:text-base text-gray-700">
                                 {analysisData.aiSummary ||
                                    "AI summary will appear here after analysis..."}
                              </p>
                           </div>
                        </CardContent>
                     </Card>

                     {/* Comments List */}
                     <Card>
                        <CardHeader>
                           <CardTitle className="text-base sm:text-lg">
                              Comments
                           </CardTitle>
                           <CardDescription>
                              Showing {analysisData.comments.length} analyzed
                              comments
                           </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="mb-4">
                              <div className="relative">
                                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                 <Input
                                    placeholder="Search comments..."
                                    className="pl-10"
                                 />
                              </div>
                           </div>

                           <div className="space-y-4">
                              {analysisData.comments.map((comment) => (
                                 <div
                                    key={comment.id}
                                    className={`border-l-4 p-3 sm:p-4 rounded-lg ${getSentimentColor(
                                       comment.sentiment
                                    )}`}
                                 >
                                    <div className="flex items-start space-x-3">
                                       <Avatar className="w-8 h-8 flex-shrink-0">
                                          <AvatarImage src={comment.avatar} />
                                          <AvatarFallback>
                                             {comment.author_name[0] || "None"}
                                          </AvatarFallback>
                                       </Avatar>
                                       <div className="flex-1 min-w-0">
                                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                             <span className="font-medium text-gray-900 truncate">
                                                {comment.author_name || "None"}
                                             </span>
                                             <div className="flex items-center space-x-2">
                                                {getSentimentIcon(
                                                   comment.sentiment
                                                )}
                                                <span className="text-sm text-gray-500">
                                                   {comment.created_at}
                                                </span>
                                             </div>
                                          </div>
                                          <p className="text-sm sm:text-base text-gray-700 mb-2">
                                             {comment.text}
                                          </p>
                                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                                             <ThumbsUp className="w-3 h-3" />
                                             <span>{comment.likes}</span>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </CardContent>
                     </Card>
                  </>
               )}
            </main>
         </SidebarInset>
      </SidebarProvider>
   );
}
