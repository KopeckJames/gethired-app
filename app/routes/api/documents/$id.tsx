import { json, type ActionFunctionArgs } from "@remix-run/node";
import { deleteDocument } from "~/models/document.server";
import { verifyToken } from "~/models/user.server";

export async function action({ request, params }: ActionFunctionArgs) {
  console.log("Processing document delete request...");

  if (request.method !== "DELETE") {
    console.log("Method not allowed:", request.method);
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const documentId = params.id;
  if (!documentId) {
    console.log("No document ID provided");
    return json({ error: "Document ID is required" }, { status: 400 });
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
  console.log("Auth token present:", !!token);

  if (!token) {
    return json(
      { error: "Please sign in to delete documents" },
      { status: 401 }
    );
  }

  try {
    console.log("Verifying token...");
    const user = await verifyToken(token);
    if (!user) {
      console.log("Token verification failed");
      return json(
        { error: "Your session has expired. Please sign in again." },
        { status: 401 }
      );
    }
    console.log("User verified:", user.id);

    console.log("Deleting document:", documentId);
    const success = await deleteDocument(documentId, user.id);

    if (!success) {
      console.log("Document not found or not owned by user");
      return json(
        { error: "Document not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    console.log("Document deleted successfully");
    return json({ success: true });
  } catch (error) {
    console.error("Error deleting document:", error);
    return json(
      { error: "Failed to delete document. Please try again." },
      { status: 500 }
    );
  }
}
