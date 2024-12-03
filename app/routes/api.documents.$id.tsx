import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { deleteDocument, getDocumentById } from "~/utils/db.server";

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    // Use mock user ID
    const mockUserId = "mock-user-id";
    const document = await getDocumentById(params.id!, mockUserId);
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

  try {
    // Use mock user ID
    const mockUserId = "mock-user-id";
    await deleteDocument(params.id!, mockUserId);
    return json({ success: true });
  } catch (error) {
    console.error("Error deleting document:", error);
    return json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
