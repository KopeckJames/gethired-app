import { supabase } from './supabase.server';
import type { Document, DocumentType } from '~/types/document';

export async function getDocuments(userId: string) {
  try {
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      return [];
    }

    return documents as Document[];
  } catch (error) {
    console.error('Error in getDocuments:', error);
    return [];
  }
}

export async function getDocumentById(id: string, userId: string) {
  try {
    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching document:', error);
      throw error;
    }

    return document as Document;
  } catch (error) {
    console.error('Error in getDocumentById:', error);
    throw error;
  }
}

export async function createDocument({
  name,
  type,
  content,
  userId,
}: {
  name: string;
  type: DocumentType;
  content: string;
  userId: string;
}) {
  try {
    const { data: document, error } = await supabase
      .from('documents')
      .insert([
        {
          name,
          type,
          content,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating document:', error);
      throw error;
    }

    return document as Document;
  } catch (error) {
    console.error('Error in createDocument:', error);
    throw error;
  }
}

export async function updateDocument({
  id,
  name,
  type,
  content,
  userId,
}: {
  id: string;
  name: string;
  type: DocumentType;
  content: string;
  userId: string;
}) {
  try {
    const { data: document, error } = await supabase
      .from('documents')
      .update({
        name,
        type,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating document:', error);
      throw error;
    }

    return document as Document;
  } catch (error) {
    console.error('Error in updateDocument:', error);
    throw error;
  }
}

export async function deleteDocument(id: string, userId: string) {
  try {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteDocument:', error);
    throw error;
  }
}

export async function getDocumentsByType(type: DocumentType, userId: string) {
  try {
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .eq('type', type)
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents by type:', error);
      return [];
    }

    return documents as Document[];
  } catch (error) {
    console.error('Error in getDocumentsByType:', error);
    return [];
  }
}
