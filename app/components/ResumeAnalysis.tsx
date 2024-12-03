import { useState } from "react";
import Card from "./Card";
import Button from "./Button";
import Select from "./Select";
import type { Document } from "~/types/document";

interface ResumeAnalysisProps {
  resumes: Document[];
  jobDescriptions: Document[];
}

interface AnalysisResult {
  score: number;
  criteriaScores: {
    keywordMatch: number;
    formatting: number;
    skillsAlignment: number;
    experienceRelevance: number;
  };
  analysis: {
    keywordsFound: string[];
    missingKeywords: string[];
    formattingIssues: string[];
    strengths: string[];
    weaknesses: string[];
  };
  recommendations: string[];
  summary: string;
}

export default function ResumeAnalysis({ resumes, jobDescriptions }: ResumeAnalysisProps) {
  const [selectedResume, setSelectedResume] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!selectedResume || !selectedJob) {
      setError("Please select both a resume and a job description");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/analysis/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeId: selectedResume,
          jobDescriptionId: selectedJob,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze resume");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to analyze resume");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card variant="bordered" className="p-6">
        <h2 className="text-xl font-semibold mb-4">Resume Analysis</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Select Resume"
            value={selectedResume}
            onChange={(e) => setSelectedResume(e.target.value)}
            options={resumes.map((resume) => ({
              value: resume.id,
              label: resume.name,
            }))}
          />
          <Select
            label="Select Job Description"
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            options={jobDescriptions.map((job) => ({
              value: job.id,
              label: job.name,
            }))}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
        <Button
          className="mt-4"
          onClick={handleAnalyze}
          isLoading={isAnalyzing}
          disabled={!selectedResume || !selectedJob}
        >
          Analyze Resume
        </Button>
      </Card>

      {analysis && (
        <Card variant="bordered" className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Overall Score</h3>
              <div className="text-3xl font-bold text-blue-600">
                {analysis.score}%
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Score Breakdown</h3>
              <div className="space-y-2">
                {Object.entries(analysis.criteriaScores).map(([key, score]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="font-semibold">{score}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold mb-2">Keywords Found</h3>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.analysis.keywordsFound.map((keyword, index) => (
                    <li key={index} className="text-green-600">
                      {keyword}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Missing Keywords</h3>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.analysis.missingKeywords.map((keyword, index) => (
                    <li key={index} className="text-red-600">
                      {keyword}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
              <ul className="list-disc list-inside space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Summary</h3>
              <p className="text-gray-700">{analysis.summary}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
