import { json, type ActionFunctionArgs, unstable_parseMultipartFormData, unstable_createMemoryUploadHandler } from "@remix-run/node";
import { createDocument } from "~/models/document.server";
import type { DocumentType } from "~/types/document";
import { verifyToken } from "~/models/user.server";

export async function action({ request }: ActionFunctionArgs) {
  console.log("Starting document upload...");

  if (request.method !== "POST") {
    console.log("Method not allowed:", request.method);
    return json({ error: "Method not allowed" }, { status: 405 });
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
      { error: "Please sign in to upload documents" },
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

    console.log("Creating upload handler...");
    const uploadHandler = unstable_createMemoryUploadHandler({
      maxPartSize: 10_000_000, // 10 MB
      filter: ({ contentType }) => {
        console.log("Checking content type:", contentType);
        // Accept common document types
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
          // Also allow generic binary and octet-stream for some PDF readers
          'application/octet-stream',
          'application/binary',
          // Common text formats
          'text/html',
          'text/csv',
          'text/markdown',
        ];
        return allowedTypes.includes(contentType || '');
      },
    });
    
    console.log("Parsing form data...");
    const formData = await unstable_parseMultipartFormData(request, uploadHandler);
    
    // Log all form data entries for debugging
    for (const [key, value] of formData.entries()) {
      console.log(`Form data entry - ${key}:`, value);
    }
    
    const uploadedFile = formData.get("file");
    const type = formData.get("type");

    console.log("File present:", !!uploadedFile);
    console.log("Document type:", type);

    if (!uploadedFile || !(uploadedFile instanceof File)) {
      console.log("Invalid file");
      return json(
        { error: "Please select a valid file" },
        { status: 400 }
      );
    }

    if (!type || typeof type !== 'string' || !['resume', 'job_description', 'cover_letter', 'other'].includes(type)) {
      console.log("Invalid document type:", type);
      return json(
        { error: "Please select a valid document type" },
        { status: 400 }
      );
    }

    console.log("Reading file content...");
    const arrayBuffer = await uploadedFile.arrayBuffer();
    const content = Buffer.from(arrayBuffer).toString('base64');

    console.log("Creating document in database...");
    const document = await createDocument({
      name: uploadedFile.name,
      type: type as DocumentType,
      content,
      userId: user.id,
    });

    console.log("Document created successfully");
    return json({ document });
  } catch (error) {
    console.error("Error uploading document:", error);
    if (error instanceof Error) {
      return json(
        { error: `Failed to upload document: ${error.message}` },
        { status: 500 }
      );
    }
    return json(
      { error: "Failed to upload document. Please try again." },
      { status: 500 }
    );
  }
}

// Export an empty component since this route only handles server-side logic
export default function DocumentUploadRoute() {
  return null;
}
