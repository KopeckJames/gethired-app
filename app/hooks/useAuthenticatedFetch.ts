import { useAuth } from "~/context/AuthContext";
import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";

export function useAuthenticatedFetch() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/?error=Please%20log%20in%20to%20continue');
    }
  }, [user, navigate]);

  return async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      if (!isAuthenticated) {
        navigate('/?error=Please%20log%20in%20to%20continue');
        throw new Error("Not authenticated");
      }

      const response = await fetch(input, {
        ...init,
        credentials: 'include',
        headers: {
          ...init?.headers,
          'Accept': 'application/json',
        },
      });

      if (response.status === 401) {
        navigate('/?error=Session%20expired.%20Please%20log%20in%20again');
        throw new Error("Unauthorized");
      }

      return response;
    } catch (error) {
      if (error instanceof Error && error.message === "Not authenticated") {
        throw error;
      }
      console.error('Request failed:', error);
      throw new Error("Failed to make request");
    }
  };
}

export function useRequireAuth() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/?error=Please%20log%20in%20to%20continue');
    }
  }, [isAuthenticated, navigate]);

  return { isAuthenticated: !!user };
}
