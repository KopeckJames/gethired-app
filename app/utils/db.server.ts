import { supabase } from './supabase.server';
import type { Document, DocumentType } from '~/types/document';

export async function getDocuments(userId: string) {
  const { data: documents, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('uploaded_at', { ascending: false });

  if (error) {
    throw error;
  }

  return documents as Document[];
}

export async function getDocumentById(id: string, userId: string) {
  const { data: document, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    throw error;
  }

  return document as Document;
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
    throw error;
  }

  return document as Document;
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
    throw error;
  }

  return document as Document;
}

export async function deleteDocument(id: string, userId: string) {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
}

// Function to get documents by type
export async function getDocumentsByType(type: DocumentType, userId: string) {
  const { data: documents, error } = await supabase
    .from('documents')
    .select('*')
    .eq('type', type)
    .eq('user_id', userId)
    .order('uploaded_at', { ascending: false });

  if (error) {
    throw error;
  }

  return documents as Document[];
}

// Function to analyze resume against job description
export async function analyzeResume(resumeId: string, jobDescriptionId: string, userId: string) {
  // First, get both documents
  const [resume, jobDescription] = await Promise.all([
    getDocumentById(resumeId, userId),
    getDocumentById(jobDescriptionId, userId),
  ]);

  // TODO: Implement actual resume analysis logic
  // For now, return a mock analysis
  return {
    score: 85,
    criteriaScores: {
      keywordMatch: 80,
      formatting: 90,
      skillsAlignment: 85,
      experienceRelevance: 85,
    },
    analysis: {
      keywordsFound: ['React', 'TypeScript', 'Node.js'],
      missingKeywords: ['Python', 'AWS'],
      formattingIssues: [],
      strengths: ['Strong technical skills', 'Clear project descriptions'],
      weaknesses: ['Missing some required technologies'],
    },
    recommendations: [
      'Consider adding experience with Python',
      'Highlight any AWS or cloud experience',
    ],
    summary: 'Your resume is well-formatted and shows strong technical skills, but could benefit from highlighting cloud experience.',
  };
}
