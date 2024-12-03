export type DocumentType = 'resume' | 'job_description' | 'cover_letter' | 'other';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  content: string;
  uploadedAt: string;
  userId: string;
}

export interface DocumentAnalysis {
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
