"use client";

import { useState } from "react";
import UrlForm from "@/components/url-form";
import ArticleSummary from "@/components/article-summary";
import ArticleContext from "@/components/article-context";
import QuizQuestions from "@/components/quiz-questions";
import ShortResponse from "@/components/short-response";
import FutureResearch from "@/components/future-research";

interface AnalysisResult {
	summary: string;
	context: string;
	keyTerms: Array<{
		term: string;
		definition: string;
	}>;
	questions: Array<{
		question: string;
		options: string[];
		correctAnswer: number;
	}>;
	shortResponseQuestions: Array<{
		id: string;
		question: string;
	}>;
	futureResearch: Array<{
		topic: string;
		description: string;
	}>;
}

export default function AnalyzePage() {
	const [result, setResult] = useState<AnalysisResult | null>(null);
	const [loading, setLoading] = useState(false);
	const [articleContent, setArticleContent] = useState<string>("");

	const handleAnalysisComplete = (
		data: AnalysisResult & { articleContent: string }
	) => {
		setResult(data);
		setArticleContent(data.articleContent);
	};

	const handleShortResponseSubmit = async (
		questionId: string,
		response: string
	) => {
		try {
			const res = await fetch("/api/feedback", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					response,
					articleContent,
				}),
			});

			if (!res.ok) {
				throw new Error("Failed to get feedback");
			}

			const data = await res.json();
			return data.feedback;
		} catch (error) {
			console.error("Error getting feedback:", error);
			throw error;
		}
	};

	return (
		<main className="container mx-auto px-4 py-8 max-w-4xl">
			<h1 className="text-4xl font-bold mb-8 text-center">Analyze Article</h1>

			<div className="space-y-8">
				<div className="max-w-xl mx-auto">
					<UrlForm onSubmit={handleAnalysisComplete} />
				</div>

				{result && (
					<div className="space-y-8">
						<ArticleSummary summary={result.summary} />

						<ArticleContext
							context={result.context}
							keyTerms={result.keyTerms}
						/>

						<QuizQuestions questions={result.questions} />

						<ShortResponse
							questions={result.shortResponseQuestions}
							onSubmitResponse={handleShortResponseSubmit}
						/>

						<FutureResearch recommendations={result.futureResearch} />
					</div>
				)}
			</div>
		</main>
	);
}
