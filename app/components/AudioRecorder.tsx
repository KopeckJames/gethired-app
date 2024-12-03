import { useState, useRef } from "react";
import Button from "./Button";
import Card from "./Card";
import { MicrophoneIcon, StopIcon, PlayIcon } from "@heroicons/react/24/outline";

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
        setAudioBlob(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setError("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleAnalyzeAudio = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append("audio", audioBlob);

    try {
      const response = await fetch("/api/analysis/audio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze audio");
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error analyzing audio:", error);
      setError("Failed to analyze audio");
    }
  };

  return (
    <Card variant="bordered" className="p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Voice Notes</h2>
        
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <div className="flex gap-4">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            variant={isRecording ? "outline" : "primary"}
            className="flex items-center gap-2"
          >
            {isRecording ? (
              <>
                <StopIcon className="h-5 w-5" />
                Stop Recording
              </>
            ) : (
              <>
                <MicrophoneIcon className="h-5 w-5" />
                Start Recording
              </>
            )}
          </Button>

          {audioBlob && (
            <Button
              onClick={handleAnalyzeAudio}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <PlayIcon className="h-5 w-5" />
              Analyze Recording
            </Button>
          )}
        </div>

        {audioBlob && (
          <div className="mt-4">
            <audio
              controls
              src={URL.createObjectURL(audioBlob)}
              className="w-full"
              aria-label="Recorded audio"
            >
              <track
                kind="captions"
                src=""
                label="Audio transcription"
                // Since this is a voice recording, we don't have captions
                // but we include the track element for accessibility
              />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </Card>
  );
}
