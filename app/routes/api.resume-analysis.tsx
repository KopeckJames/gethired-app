import { json, type ActionFunctionArgs } from "@remix-run/node";
import { getDocument } from "~/models/document.server";
import { verifyToken } from "~/models/user.server";

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

function analyzeResume(resumeContent: string, jobDescription: string): AnalysisResult {
  // Extract keywords from job description
  const jobKeywords = extractKeywords(jobDescription);
  
  // Extract keywords from resume
  const resumeKeywords = extractKeywords(resumeContent);
  
  // Find matching and missing keywords
  const keywordsFound = jobKeywords.filter(keyword => 
    resumeKeywords.some(k => k.toLowerCase() === keyword.toLowerCase())
  );
  const missingKeywords = jobKeywords.filter(keyword => 
    !resumeKeywords.some(k => k.toLowerCase() === keyword.toLowerCase())
  );

  // Calculate scores
  const keywordScore = (keywordsFound.length / jobKeywords.length) * 100;
  const formattingScore = analyzeFormatting(resumeContent);
  const skillsScore = analyzeSkills(resumeContent, jobDescription);
  const experienceScore = analyzeExperience(resumeContent, jobDescription);

  const overallScore = Math.round(
    (keywordScore + formattingScore + skillsScore + experienceScore) / 4
  );

  return {
    score: overallScore,
    criteriaScores: {
      keywordMatch: Math.round(keywordScore),
      formatting: Math.round(formattingScore),
      skillsAlignment: Math.round(skillsScore),
      experienceRelevance: Math.round(experienceScore),
    },
    analysis: {
      keywordsFound,
      missingKeywords,
      formattingIssues: analyzeFormattingIssues(resumeContent),
      strengths: analyzeStrengths(resumeContent, jobDescription),
      weaknesses: analyzeWeaknesses(resumeContent, jobDescription),
    },
    recommendations: generateRecommendations(resumeContent, jobDescription),
    summary: generateSummary(resumeContent, jobDescription),
  };
}

function extractKeywords(text: string): string[] {
  // Simple keyword extraction (you might want to use a more sophisticated approach)
  const commonWords = new Set(['and', 'or', 'the', 'in', 'on', 'at', 'to', 'for', 'with', 'by']);
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word))
    .map(word => word.charAt(0).toUpperCase() + word.slice(1));
}

function analyzeFormatting(content: string): number {
  // Simple formatting analysis (you might want to expand this)
  const hasProperSections = /education|experience|skills/i.test(content);
  const hasProperSpacing = content.includes('\n\n');
  const hasProperLength = content.length > 200 && content.length < 5000;

  let score = 0;
  if (hasProperSections) score += 33;
  if (hasProperSpacing) score += 33;
  if (hasProperLength) score += 34;

  return score;
}

function analyzeFormattingIssues(content: string): string[] {
  const issues: string[] = [];

  if (!/education|experience|skills/i.test(content)) {
    issues.push("Missing key sections (Education, Experience, or Skills)");
  }
  if (!content.includes('\n\n')) {
    issues.push("Improve spacing between sections");
  }
  if (content.length < 200) {
    issues.push("Resume is too short");
  }
  if (content.length > 5000) {
    issues.push("Resume is too long");
  }

  return issues;
}

function analyzeSkills(resume: string, jobDescription: string): number {
  const jobSkills = extractKeywords(jobDescription);
  const resumeSkills = extractKeywords(resume);
  
  const matchingSkills = jobSkills.filter(skill => 
    resumeSkills.some(s => s.toLowerCase() === skill.toLowerCase())
  );

  return (matchingSkills.length / jobSkills.length) * 100;
}

function analyzeExperience(resume: string, jobDescription: string): number {
  // Simple experience analysis (you might want to expand this)
  const jobKeywords = extractKeywords(jobDescription);
  const resumeContent = resume.toLowerCase();
  
  const relevantExperience = jobKeywords.filter(keyword => 
    resumeContent.includes(keyword.toLowerCase())
  );

  return (relevantExperience.length / jobKeywords.length) * 100;
}

function analyzeStrengths(resume: string, jobDescription: string): string[] {
  const strengths: string[] = [];
  const jobKeywords = extractKeywords(jobDescription);
  const resumeKeywords = extractKeywords(resume);

  const matchingKeywords = jobKeywords.filter(keyword => 
    resumeKeywords.some(k => k.toLowerCase() === keyword.toLowerCase())
  );

  if (matchingKeywords.length > jobKeywords.length * 0.7) {
    strengths.push("Strong keyword alignment with job requirements");
  }

  if (/\d+\s*years?\s*experience/i.test(resume)) {
    strengths.push("Clearly stated years of experience");
  }

  if (/education|degree|certification/i.test(resume)) {
    strengths.push("Relevant educational background");
  }

  return strengths;
}

function analyzeWeaknesses(resume: string, jobDescription: string): string[] {
  const weaknesses: string[] = [];
  const jobKeywords = extractKeywords(jobDescription);
  const resumeKeywords = extractKeywords(resume);

  const missingKeywords = jobKeywords.filter(keyword => 
    !resumeKeywords.some(k => k.toLowerCase() === keyword.toLowerCase())
  );

  if (missingKeywords.length > jobKeywords.length * 0.3) {
    weaknesses.push("Missing several key job requirements");
  }

  if (resume.length < 300) {
    weaknesses.push("Resume might be too brief");
  }

  if (!/achievements?|accomplishments?/i.test(resume)) {
    weaknesses.push("Could highlight more specific achievements");
  }

  return weaknesses;
}

function generateRecommendations(resume: string, jobDescription: string): string[] {
  const recommendations: string[] = [];
  const jobKeywords = extractKeywords(jobDescription);
  const resumeKeywords = extractKeywords(resume);

  const missingKeywords = jobKeywords.filter(keyword => 
    !resumeKeywords.some(k => k.toLowerCase() === keyword.toLowerCase())
  );

  if (missingKeywords.length > 0) {
    recommendations.push(`Add missing keywords: ${missingKeywords.join(', ')}`);
  }

  if (!/achievements?|accomplishments?/i.test(resume)) {
    recommendations.push("Add specific achievements and measurable results");
  }

  if (!/education|degree|certification/i.test(resume)) {
    recommendations.push("Include relevant education or certifications");
  }

  return recommendations;
}

function generateSummary(resume: string, jobDescription: string): string {
  const jobKeywords = extractKeywords(jobDescription);
  const resumeKeywords = extractKeywords(resume);
  const matchingKeywords = jobKeywords.filter(keyword => 
    resumeKeywords.some(k => k.toLowerCase() === keyword.toLowerCase())
  );
  const matchPercentage = Math.round((matchingKeywords.length / jobKeywords.length) * 100);

  return `Your resume matches ${matchPercentage}% of the job requirements. ${
    matchPercentage >= 70
      ? "You appear to be a strong candidate for this position."
      : "Consider updating your resume to better align with the job requirements."
  }`;
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json(
      { error: "Method not allowed" },
      { 
        status: 405,
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
  }

  // Get token from cookie
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(cookie => {
      const [name, value] = cookie.split('=');
      return [name, decodeURIComponent(value)];
    })
  );
  
  const token = cookies.auth_token;

  if (!token) {
    return json(
      { error: "Not authenticated" },
      { 
        status: 401,
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
  }

  try {
    const user = await verifyToken(token);
    if (!user) {
      return json(
        { error: "Invalid authentication" },
        { 
          status: 401,
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
    }

    const { resumeId, jobDescriptionId } = await request.json();

    if (!resumeId || !jobDescriptionId) {
      return json(
        { error: "Please select both a resume and job description" },
        { 
          status: 400,
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
    }

    // Get documents
    const [resume, jobDescription] = await Promise.all([
      getDocument(resumeId, user.id),
      getDocument(jobDescriptionId, user.id),
    ]);

    if (!resume || !jobDescription) {
      return json(
        { error: "Documents not found" },
        { 
          status: 404,
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
    }

    // Analyze resume
    const analysis = analyzeResume(resume.content, jobDescription.content);

    return json(
      { analysis },
      {
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return json(
      { error: "Failed to analyze resume" },
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
  }
}
