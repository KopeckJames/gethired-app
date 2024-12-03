import { useAuth } from "~/context/AuthContext";
import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";

export function useAuthenticatedFetch() {
  const { accessToken, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session && !accessToken) {
      navigate('/?error=Please%20log%20in%20to%20continue');
    }
  }, [session, accessToken, navigate]);

  return async (input: RequestInfo | URL, init?: RequestInit) => {
    if (!accessToken) {
      throw new Error("No access token available");
    }

    const headers = new Headers(init?.headers);
    headers.set("Authorization", `Bearer ${accessToken}`);

    const response = await fetch(input, {
      ...init,
      headers,
    });

    if (response.status === 401) {
      navigate('/?error=Session%20expired.%20Please%20log%20in%20again');
      throw new Error("Unauthorized");
    }

    return response;
  };
}

export function useRequireAuth() {
  const { session, accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session && !accessToken) {
      navigate('/?error=Please%20log%20in%20to%20continue');
    }
  }, [session, accessToken, navigate]);

  return { isAuthenticated: !!session || !!accessToken };
}
