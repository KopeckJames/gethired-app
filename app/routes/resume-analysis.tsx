import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getDocumentsByType } from "~/utils/db.server";
import ResumeAnalysis from "~/components/ResumeAnalysis";
import type { Document } from "~/types/document";

interface LoaderData {
  resumes: Document[];
  jobDescriptions: Document[];
  error: string | null;
}

export async function loader() {
  try {
    // For now, we'll use a mock user ID
    const mockUserId = "mock-user-id";
    const [resumes, jobDescriptions] = await Promise.all([
      getDocumentsByType("resume", mockUserId),
      getDocumentsByType("job_description", mockUserId),
    ]);

    return json<LoaderData>({ 
      resumes: resumes || [], 
      jobDescriptions: jobDescriptions || [], 
      error: null 
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return json<LoaderData>({ 
      resumes: [], 
      jobDescriptions: [], 
      error: "Failed to load documents" 
    });
  }
}

export default function ResumeAnalysisPage() {
  const { resumes, jobDescriptions, error } = useLoaderData<typeof loader>();

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Resume Analysis</h1>
      {resumes.length === 0 || jobDescriptions.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No Documents Found</h2>
          <p className="text-gray-600 mb-4">
            Please upload at least one resume and one job description to use this feature.
          </p>
          <a
            href="/documents"
            className="text-blue-600 hover:text-blue-700"
          >
            Go to Documents →
          </a>
        </div>
      ) : (
        <ResumeAnalysis
          resumes={resumes}
          jobDescriptions={jobDescriptions}
        />
      )}
    </div>
  );
}
