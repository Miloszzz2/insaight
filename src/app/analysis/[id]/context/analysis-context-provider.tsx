"use client";
import { AnalysisData } from "@/types/analysis/analysis-data";
import { createContext, useContext, useState, ReactNode } from "react";

type AnalysisContextType = {
	isAnalyzed: boolean;
	setIsAnalyzed: React.Dispatch<React.SetStateAction<boolean>>;
	isAnalyzing: boolean;
	setIsAnalyzing: React.Dispatch<React.SetStateAction<boolean>>;
	analysisStep: number;
	setAnalysisStep: React.Dispatch<React.SetStateAction<number>>;
	error: string | null;
	setError: React.Dispatch<React.SetStateAction<string | null>>;
	analysisData: AnalysisData;
	setAnalysisData: React.Dispatch<React.SetStateAction<AnalysisData>>;
	numComments: number;
	setNumComments: React.Dispatch<React.SetStateAction<number>>;
};

const AnalysisContext = createContext<AnalysisContextType | undefined>(
	undefined
);

export function AnalysisContextProvider({ children }: { children: ReactNode }) {
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
	const [numComments, setNumComments] = useState<number>(100);

	return (
		<AnalysisContext.Provider
			value={{
				isAnalyzed,
				setIsAnalyzed,
				isAnalyzing,
				setIsAnalyzing,
				analysisStep,
				setAnalysisStep,
				error,
				setError,
				analysisData,
				setAnalysisData,
				numComments,
				setNumComments,
			}}
		>
			{children}
		</AnalysisContext.Provider>
	);
}

export function useAnalysis() {
	const context = useContext(AnalysisContext);
	if (!context) {
		throw new Error("useAnalysis must be used within an AnalysisProvider");
	}
	return context;
}