import { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseInitialized } from "~/utils/supabase.client";
import type { Session } from "@supabase/supabase-js";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isAuthenticated: boolean;
  session: Session | null;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isSupabaseInitialized()) {
      console.error('Supabase is not properly initialized');
      return;
    }

    setIsInitialized(true);

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAccessToken(session?.access_token ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAccessToken(session?.access_token ?? null);

      // Store session in localStorage
      if (session) {
        localStorage.setItem('supabase.auth.token', session.access_token);
      } else {
        localStorage.removeItem('supabase.auth.token');
      }
    });

    // Check for stored token on mount
    const storedToken = localStorage.getItem('supabase.auth.token');
    if (storedToken) {
      setAccessToken(storedToken);
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    accessToken,
    setAccessToken,
    isAuthenticated: !!session,
    session,
    isInitialized,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
