import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { deleteDocument, getDocumentById } from "~/utils/db.server";
import { getUserByAccessToken } from "~/utils/supabase.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
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
    const document = await getDocumentById(params.id!, user.id);
    return json({ document });
  } catch (error) {
    console.error("Error fetching document:", error);
    return json(
      { error: "Document not found" },
      { status: 404 }
    );
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== "DELETE") {
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
    await deleteDocument(params.id!, user.id);
    return json({ success: true });
  } catch (error) {
    console.error("Error deleting document:", error);
    return json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
