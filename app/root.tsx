import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import "~/styles/tailwind.css";
import { NotificationProvider } from "~/context/NotificationContext";
import { ApplicationProvider } from "~/context/ApplicationContext";
import { AuthProvider } from "~/context/AuthContext";
import Layout from "~/components/Layout";
import { getPublicEnv } from "~/utils/env.server";
import { json } from "@remix-run/node";
import { useEffect } from "react";
import Alert from "~/components/Alert";

export const links: LinksFunction = () => [
  {
    rel: "icon",
    href: "/favicon.ico",
    type: "image/x-icon",
  },
];

export async function loader() {
  const env = getPublicEnv();
  
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    console.error('Missing required environment variables');
  }

  return json({
    ENV: env,
  });
}

export default function App() {
  const { ENV } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');

  // Clear error from URL after displaying
  useEffect(() => {
    if (error) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [error]);

  // Initialize ENV in window before rendering auth provider
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.ENV = ENV;
    }
  }, [ENV]);

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Track and manage your job applications with GetHired!" />
        <meta name="theme-color" content="#000000" />
        <title>GetHired! - Job Application Tracker</title>
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-white text-slate-900 antialiased">
        <AuthProvider>
          <NotificationProvider>
            <ApplicationProvider>
              <Layout>
                {error && (
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <Alert variant="error" onClose={() => {
                      const newUrl = new URL(window.location.href);
                      newUrl.searchParams.delete('error');
                      window.history.replaceState({}, '', newUrl.toString());
                    }}>
                      {decodeURIComponent(error)}
                    </Alert>
                  </div>
                )}
                <Outlet />
              </Layout>
            </ApplicationProvider>
          </NotificationProvider>
        </AuthProvider>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

// Error boundary
export function ErrorBoundary({ error }: { error: Error | null }) {
  const errorMessage = error?.message || "An unexpected error occurred";
  
  return (
    <html lang="en" className="h-full">
      <head>
        <title>Error - GetHired!</title>
        <Meta />
        <Links />
      </head>
      <body className="flex h-full flex-col items-center justify-center bg-white text-slate-900">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">Oops! Something went wrong</h1>
          <p className="text-lg text-slate-600">
            {errorMessage}
          </p>
          <div>
            <a
              href="/"
              className="text-blue-600 hover:text-blue-700"
            >
              Go back home →
            </a>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
