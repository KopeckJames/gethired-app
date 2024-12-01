import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "~/styles/tailwind.css";
import { NotificationProvider } from "~/context/NotificationContext";
import { ApplicationProvider } from "~/context/ApplicationContext";
import Layout from "~/components/Layout";

export const links: LinksFunction = () => [
  {
    rel: "icon",
    href: "/favicon.ico",
    type: "image/x-icon",
  },
];

export default function App() {
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
        <NotificationProvider>
          <ApplicationProvider>
            <Layout>
              <Outlet />
            </Layout>
          </ApplicationProvider>
        </NotificationProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

// Error boundary
export function ErrorBoundary({ error }: { error: Error }) {
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
            {error.message}
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
