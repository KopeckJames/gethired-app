import { json, type ActionFunctionArgs } from "@remix-run/node";
import { getDocumentById } from "~/utils/db.server";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { resumeId, jobDescriptionId } = await request.json();

    if (!resumeId || !jobDescriptionId) {
      return json(
        { error: "Both resume and job description are required" },
        { status: 400 }
      );
    }

    // Use mock user ID
    const mockUserId = "mock-user-id";
    const [resume, jobDescription] = await Promise.all([
      getDocumentById(resumeId, mockUserId),
      getDocumentById(jobDescriptionId, mockUserId),
    ]);

    // Extract keywords from job description (simple example)
    const jobKeywords = jobDescription.content
      .toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3);

    // Find matching keywords in resume
    const resumeContent = resume.content.toLowerCase();
    const keywordsFound = jobKeywords.filter(keyword => resumeContent.includes(keyword));
    const missingKeywords = jobKeywords.filter(keyword => !resumeContent.includes(keyword));

    // Calculate scores
    const keywordMatchScore = Math.round((keywordsFound.length / jobKeywords.length) * 100);
    const formattingScore = 90; // Mock score
    const skillsAlignmentScore = Math.round((keywordsFound.length / jobKeywords.length) * 100);
    const experienceRelevanceScore = 85; // Mock score

    const analysis = {
      score: Math.round((keywordMatchScore + formattingScore + skillsAlignmentScore + experienceRelevanceScore) / 4),
      criteriaScores: {
        keywordMatch: keywordMatchScore,
        formatting: formattingScore,
        skillsAlignment: skillsAlignmentScore,
        experienceRelevance: experienceRelevanceScore,
      },
      analysis: {
        keywordsFound,
        missingKeywords,
        formattingIssues: [],
        strengths: ['Strong technical skills', 'Clear project descriptions'],
        weaknesses: missingKeywords.length > 0 ? ['Missing some required keywords'] : [],
      },
      recommendations: [
        ...missingKeywords.map(keyword => `Consider adding experience with ${keyword}`),
        'Ensure your resume is properly formatted',
      ],
      summary: `Your resume matches ${keywordMatchScore}% of the job requirements. ${
        missingKeywords.length > 0 
          ? 'Consider adding experience with the missing keywords to improve your match.'
          : 'Great job! Your resume matches all the key requirements.'
      }`,
    };

    return json({ analysis });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
