import ChatInterface from "~/components/ChatInterface";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

interface LoaderData {
  error: string | null;
}

export async function loader() {
  return json<LoaderData>({ error: null });
}

export default function Chat() {
  const { error } = useLoaderData<typeof loader>();

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">AI Assistant</h1>
      <ChatInterface />
    </div>
  );
}
