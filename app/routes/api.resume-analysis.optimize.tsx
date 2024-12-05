import { json, type ActionFunctionArgs } from "@remix-run/node";
import { getDocument, createDocument } from "~/models/document.server";
import { verifyToken } from "~/models/user.server";
import { optimizeResumeWithClaude } from "~/utils/anthropic.server";
import { ObjectId } from "mongodb";

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  try {
    new ObjectId(id);
    return true;
  } catch (error) {
    return false;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json(
      { error: "Method not allowed" },
      { status: 405 }
    );
  }

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
      { error: "Please sign in to optimize your resume" },
      { status: 401 }
    );
  }

  try {
    const user = await verifyToken(token);
    if (!user) {
      return json(
        { error: "Your session has expired. Please sign in again." },
        { status: 401 }
      );
    }

    const { resumeId, jobDescriptionId } = await request.json();

    if (!resumeId || !jobDescriptionId) {
      return json(
        { error: "Please select both a resume and job description" },
        { status: 400 }
      );
    }

    // Validate document IDs
    if (!isValidObjectId(resumeId)) {
      return json(
        { error: "Invalid resume ID format. The document might have been deleted." },
        { status: 400 }
      );
    }

    if (!isValidObjectId(jobDescriptionId)) {
      return json(
        { error: "Invalid job description ID format. The document might have been deleted." },
        { status: 400 }
      );
    }

    // Get documents
    const [resume, jobDescription] = await Promise.all([
      getDocument(resumeId, user.id),
      getDocument(jobDescriptionId, user.id),
    ]);

    if (!resume) {
      return json(
        { error: "Resume not found. It might have been deleted." },
        { status: 404 }
      );
    }

    if (!jobDescription) {
      return json(
        { error: "Job description not found. It might have been deleted." },
        { status: 404 }
      );
    }

    // Use Claude to optimize the resume
    const optimization = await optimizeResumeWithClaude(resume.content, jobDescription.content);

    // Create a new document with the optimized content
    const optimizedDocument = await createDocument({
      name: `${resume.name} (Optimized)`,
      content: optimization.optimizedContent,
      type: 'resume',
      userId: user.id,
    });

    return json({
      optimization: {
        ...optimization,
        formattedDocumentId: optimizedDocument.id,
      },
    });
  } catch (error) {
    console.error("Error optimizing resume:", error);
    return json(
      { error: error instanceof Error ? error.message : "Failed to optimize resume. Please try again." },
      { status: 500 }
    );
  }
}
