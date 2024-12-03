import AudioRecorder from "~/components/AudioRecorder";
import Card from "~/components/Card";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

interface LoaderData {
  error: string | null;
}

export async function loader() {
  return json<LoaderData>({ error: null });
}

export default function VoiceNotes() {
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
      <h1 className="text-2xl font-bold mb-6">Voice Notes</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <AudioRecorder />
        <Card variant="bordered" className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Previous Recordings</h2>
            <div className="text-gray-500 text-sm">
              Your recorded and analyzed voice notes will appear here.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
