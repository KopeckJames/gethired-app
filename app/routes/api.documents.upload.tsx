import { json, type ActionFunctionArgs } from "@remix-run/node";
import { createDocument } from "~/utils/db.server";
import { getUserByAccessToken } from "~/utils/supabase.server";
import type { DocumentType } from "~/types/document";

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
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as DocumentType;

    if (!file || !type) {
      return json({ error: "Missing required fields" }, { status: 400 });
    }

    // Read file content
    const content = await file.text();

    const document = await createDocument({
      name: file.name,
      type,
      content,
      userId: user.id,
    });

    return json({ document });
  } catch (error) {
    console.error("Error uploading document:", error);
    return json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}
