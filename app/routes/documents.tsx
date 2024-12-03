import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Card from "~/components/Card";
import Button from "~/components/Button";
import Input from "~/components/Input";
import Select from "~/components/Select";
import Modal from "~/components/Modal";
import Alert from "~/components/Alert";
import EmptyState from "~/components/EmptyState";
import { useState, useRef } from "react";
import type { Document, DocumentType } from "~/types/document";
import { getDocuments } from "~/utils/db.server";

interface LoaderData {
  documents: Document[];
  error: string | null;
}

export async function loader() {
  try {
    // For now, we'll use a mock user ID
    const mockUserId = "mock-user-id";
    const documents = await getDocuments(mockUserId);
    return json<LoaderData>({ documents, error: null });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return json<LoaderData>({ 
      documents: [], 
      error: "Failed to load documents" 
    });
  }
}

export default function Documents() {
  const { documents, error: loaderError } = useLoaderData<typeof loader>();
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [docType, setDocType] = useState<DocumentType>("resume");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", docType);

    try {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload document");
      }

      // Reset form
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setShowUploadModal(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete document");
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
                    onClick={() => handleDelete(doc.id)}
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
        onClose={() => setShowUploadModal(false)}
        title="Upload Document"
      >
        <div className="space-y-4">
          <Select
            label="Document Type"
            value={docType}
            onChange={(e) => setDocType(e.target.value as DocumentType)}
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
            onChange={handleFileUpload}
            disabled={isUploading}
          />

          <p className="text-sm text-gray-500">
            Supported formats: PDF, DOC, DOCX, TXT
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        title={selectedDoc?.name ?? ""}
      >
        <div className="max-h-[60vh] overflow-y-auto">
          <pre className="whitespace-pre-wrap">{selectedDoc?.content}</pre>
        </div>
      </Modal>
    </div>
  );
}
