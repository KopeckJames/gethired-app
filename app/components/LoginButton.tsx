import { useAuth } from "~/context/AuthContext";
import Button from "./Button";
import { useNavigate } from "@remix-run/react";

export default function LoginButton() {
  const { isAuthenticated, isInitialized } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Use window.location.origin for local development fallback
      const redirectUri = `${window.ENV.APP_URL || window.location.origin}/auth/callback`;
      const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      
      googleAuthUrl.searchParams.append('client_id', window.ENV.GOOGLE_CLIENT_ID);
      googleAuthUrl.searchParams.append('redirect_uri', redirectUri);
      googleAuthUrl.searchParams.append('response_type', 'code');
      googleAuthUrl.searchParams.append('scope', 'email profile');
      googleAuthUrl.searchParams.append('access_type', 'offline');
      googleAuthUrl.searchParams.append('prompt', 'consent');

      window.location.href = googleAuthUrl.toString();
    } catch (error) {
      console.error('Error logging in:', error);
      navigate('/?error=' + encodeURIComponent('Failed to sign in. Please try again.'));
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to sign out');
      }

      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
      navigate('/?error=' + encodeURIComponent('Failed to sign out. Please try again.'));
    }
  };

  // Don't render until auth is initialized
  if (!isInitialized) {
    return (
      <Button
        variant="outline"
        disabled
        className="flex items-center gap-2"
      >
        Loading...
      </Button>
    );
  }

  return (
    <Button
      onClick={isAuthenticated ? handleLogout : handleLogin}
      variant="outline"
      className="flex items-center gap-2"
    >
      {!isAuthenticated && (
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )}
      {isAuthenticated ? 'Sign Out' : 'Sign in with Google'}
    </Button>
  );
}
