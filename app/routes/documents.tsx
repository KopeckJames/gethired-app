import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import Card from "~/components/Card";
import Button from "~/components/Button";
import Input from "~/components/Input";
import Select from "~/components/Select";
import Modal from "~/components/Modal";
import Alert from "~/components/Alert";
import EmptyState from "~/components/EmptyState";
import { useState, useRef } from "react";
import type { DocumentType, SerializedDocument } from "~/types/document";
import { getDocuments } from "~/models/document.server";
import { useAuth } from "~/context/AuthContext";
import { verifyToken } from "~/models/user.server";
import { serializeDocument } from "~/types/document";
import { useAuthenticatedFetch } from "~/hooks/useAuthenticatedFetch";

interface LoaderData {
  documents: SerializedDocument[];
  error: string | null;
}

export async function loader({ request }: LoaderFunctionArgs) {
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
      { documents: [], error: "Please sign in to view documents" },
      { status: 401 }
    );
  }

  try {
    const user = await verifyToken(token);
    if (!user) {
      return json(
        { documents: [], error: "Please sign in to view documents" },
        { status: 401 }
      );
    }

    const documents = await getDocuments(user.id);
    return json<LoaderData>(
      { 
        documents: documents.map(serializeDocument), 
        error: null 
      }
    );
  } catch (error) {
    console.error('Error fetching documents:', error);
    return json<LoaderData>(
      { documents: [], error: "Failed to load documents" },
      { status: 500 }
    );
  }
}

export default function Documents() {
  const { documents, error: loaderError } = useLoaderData<typeof loader>();
  const [selectedDoc, setSelectedDoc] = useState<SerializedDocument | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [docType, setDocType] = useState<DocumentType>("resume");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const revalidator = useRevalidator();
  const authenticatedFetch = useAuthenticatedFetch();

  if (loaderError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{loaderError}</p>
        </div>
      </div>
    );
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("type", docType);

    try {
      console.log('Starting upload to /api/documents/upload...');
      const response = await authenticatedFetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      console.log('Upload response status:', response.status);
      const contentType = response.headers.get('content-type');
      console.log('Response content type:', contentType);

      if (!response.ok) {
        const text = await response.text();
        console.error('Upload failed. Response:', text);
        try {
          const data = JSON.parse(text);
          throw new Error(data.error || "Failed to upload document");
        } catch (e) {
          throw new Error(`Failed to upload document: ${text}`);
        }
      }

      const data = await response.json();
      console.log('Upload successful:', data);

      // Reset form and close modal
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSelectedFile(null);
      setShowUploadModal(false);
      
      // Refresh the documents list
      revalidator.revalidate();
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : "Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await authenticatedFetch(`/api/documents/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete document");
      }

      const data = await response.json();

      // Only refresh if the delete was successful
      if (data.success) {
        revalidator.revalidate();
      } else {
        setError(data.error || "Failed to delete document");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete document");
    }
  };

  const renderDocumentContent = (content: string, type: string) => {
    try {
      // Try to decode base64 content
      const decodedContent = atob(content);
      if (type === "application/pdf") {
        return (
          <iframe
            src={`data:application/pdf;base64,${content}`}
            className="w-full h-[60vh]"
            title="PDF Document"
          />
        );
      } else {
        return <pre className="whitespace-pre-wrap">{decodedContent}</pre>;
      }
    } catch {
      // If decoding fails, display as plain text
      return <pre className="whitespace-pre-wrap">{content}</pre>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Documents</h1>
        <Button onClick={() => setShowUploadModal(true)}>Upload Document</Button>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {documents.length === 0 ? (
        <EmptyState
          title="No documents"
          description="Upload your first document to get started"
          action={
            <Button onClick={() => setShowUploadModal(true)}>
              Upload Document
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <Card
              key={doc.id}
              variant="bordered"
              className="p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{doc.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{doc.type}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this document?')) {
                        handleDelete(doc.id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setSelectedFile(null);
          setError(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
        title="Upload Document"
      >
        <div className="space-y-4">
          <Select
            label="Document Type"
            value={docType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDocType(e.target.value as DocumentType)}
            options={[
              { value: "resume", label: "Resume" },
              { value: "job_description", label: "Job Description" },
              { value: "cover_letter", label: "Cover Letter" },
              { value: "other", label: "Other" },
            ]}
          />

          <Input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            disabled={isUploading}
          />

          <p className="text-sm text-gray-500">
            Supported formats: PDF, DOC, DOCX, TXT
          </p>

          {error && (
            <Alert variant="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowUploadModal(false);
                setSelectedFile(null);
                setError(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!selectedDoc}
        onClose={() => {
          setSelectedDoc(null);
          setError(null);
        }}
        title={selectedDoc?.name ?? ""}
      >
        <div className="max-h-[60vh] overflow-y-auto">
          {selectedDoc && renderDocumentContent(selectedDoc.content, selectedDoc.type)}
        </div>
      </Modal>
    </div>
  );
}
