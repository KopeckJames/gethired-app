import { createClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    ENV: {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
    };
  }
}

// Initialize with default values that will be overridden by window.ENV
export const supabase = createClient(
  typeof window !== 'undefined' ? window.ENV?.SUPABASE_URL : '',
  typeof window !== 'undefined' ? window.ENV?.SUPABASE_ANON_KEY : '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

// Function to check if Supabase is properly initialized
export function isSupabaseInitialized(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window.ENV?.SUPABASE_URL && window.ENV?.SUPABASE_ANON_KEY);
}
