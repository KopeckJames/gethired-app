import { ObjectId } from 'mongodb';
import { getDb } from '~/utils/db.server';
import type { Document, DocumentType, DocumentCreate } from '~/types/document';

interface DocumentModel {
  _id: ObjectId;
  userId: ObjectId;
  name: string;
  type: DocumentType;
  content: string;
  uploadedAt: Date;
}

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  try {
    new ObjectId(id);
    return true;
  } catch (error) {
    console.error("Invalid ObjectId:", id, error);
    return false;
  }
}

function mapDocumentToResponse(doc: DocumentModel): Document {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    name: doc.name,
    type: doc.type,
    content: doc.content,
    uploadedAt: doc.uploadedAt,
  };
}

export async function getDocuments(userId: string): Promise<Document[]> {
  console.log("Getting documents for user:", userId);
  
  if (!isValidObjectId(userId)) {
    console.error("Invalid user ID format:", userId);
    return [];
  }

  try {
    const db = await getDb();
    const documents = await db
      .db()
      .collection<DocumentModel>('documents')
      .find({ userId: new ObjectId(userId) })
      .sort({ uploadedAt: -1 })
      .toArray();

    console.log(`Found ${documents.length} documents for user ${userId}`);
    return documents.map(mapDocumentToResponse);
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
}

export async function getDocumentsByType(type: DocumentType, userId: string): Promise<Document[]> {
  console.log("Getting documents by type:", type, "for user:", userId);
  
  if (!isValidObjectId(userId)) {
    console.error("Invalid user ID format:", userId);
    return [];
  }

  try {
    const db = await getDb();
    const documents = await db
      .db()
      .collection<DocumentModel>('documents')
      .find({ 
        userId: new ObjectId(userId),
        type: type
      })
      .sort({ uploadedAt: -1 })
      .toArray();

    console.log(`Found ${documents.length} documents of type ${type} for user ${userId}`);
    return documents.map(mapDocumentToResponse);
  } catch (error) {
    console.error("Error getting documents by type:", error);
    throw error;
  }
}

export async function createDocument(data: DocumentCreate): Promise<Document> {
  console.log("Creating document:", { name: data.name, type: data.type, userId: data.userId });
  
  if (!isValidObjectId(data.userId)) {
    console.error("Invalid user ID format:", data.userId);
    throw new Error('Invalid user ID format');
  }

  try {
    const db = await getDb();
    const doc: Omit<DocumentModel, '_id'> = {
      userId: new ObjectId(data.userId),
      name: data.name,
      type: data.type,
      content: data.content,
      uploadedAt: new Date(),
    };

    const result = await db
      .db()
      .collection<DocumentModel>('documents')
      .insertOne(doc as DocumentModel);

    console.log("Document created successfully with ID:", result.insertedId);

    return {
      id: result.insertedId.toString(),
      userId: data.userId,
      name: data.name,
      type: data.type,
      content: data.content,
      uploadedAt: doc.uploadedAt,
    };
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
}

export async function updateDocument(id: string, userId: string, content: string): Promise<Document | null> {
  console.log("Updating document:", id, "for user:", userId);
  
  if (!isValidObjectId(id) || !isValidObjectId(userId)) {
    console.error("Invalid ID format:", { documentId: id, userId });
    return null;
  }

  try {
    const db = await getDb();
    const collection = db.db().collection<DocumentModel>('documents');
    
    // Update the document
    const updateResult = await collection.updateOne(
      {
        _id: new ObjectId(id),
        userId: new ObjectId(userId),
      },
      {
        $set: { content },
      }
    );

    if (updateResult.matchedCount === 0) {
      console.log("No document found to update");
      return null;
    }

    // Fetch the updated document
    const updatedDoc = await collection.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId),
    });

    if (!updatedDoc) {
      console.log("Updated document not found");
      return null;
    }

    console.log("Document updated successfully");
    return mapDocumentToResponse(updatedDoc);
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
}

export async function deleteDocument(id: string, userId: string): Promise<boolean> {
  console.log("Deleting document:", id, "for user:", userId);
  
  if (!isValidObjectId(id) || !isValidObjectId(userId)) {
    console.error("Invalid ID format:", { documentId: id, userId });
    return false;
  }

  try {
    const db = await getDb();
    const result = await db
      .db()
      .collection('documents')
      .deleteOne({
        _id: new ObjectId(id),
        userId: new ObjectId(userId),
      });

    console.log("Delete result:", result.deletedCount > 0 ? "Success" : "No document found");
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}

export async function getDocument(id: string, userId: string): Promise<Document | null> {
  console.log("Getting document:", id, "for user:", userId);
  
  if (!isValidObjectId(id) || !isValidObjectId(userId)) {
    console.error("Invalid ID format:", { documentId: id, userId });
    return null;
  }

  try {
    const db = await getDb();
    const document = await db
      .db()
      .collection<DocumentModel>('documents')
      .findOne({
        _id: new ObjectId(id),
        userId: new ObjectId(userId),
      });

    if (!document) {
      console.log("Document not found");
      return null;
    }

    console.log("Document found successfully");
    return mapDocumentToResponse(document);
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
}
