import { json, type ActionFunctionArgs } from "@remix-run/node";
import { analyzeResume } from "~/utils/db.server";
import { getUserByAccessToken } from "~/utils/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = authHeader.replace("Bearer ", "");
  const user = await getUserByAccessToken(accessToken);
  
  if (!user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { resumeId, jobDescriptionId } = await request.json();

    if (!resumeId || !jobDescriptionId) {
      return json(
        { error: "Both resume and job description are required" },
        { status: 400 }
      );
    }

    const analysis = await analyzeResume(resumeId, jobDescriptionId, user.id);
    return json({ analysis });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
