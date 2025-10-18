"use client";

import { useState } from "react";
import FileUpload from "./fileUpload";
import { useRouter } from "next/navigation";

export default function VideoUploadForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const router = useRouter();

  const handleSuccess = (response: any) => {
    setVideoUrl(response.filePath);
  };

  const handleProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) return alert("Please upload a video first");

    router.push("/");

    // Save video info to DB
    console.log("Sending video data to backend:", {
  title,
  description,
  videoUrl,
  controls: true,
});

    await fetch("/api/video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        videoUrl,
        controls: true,
      }),
    });

    console.log("Video uploaded:", { title, description, videoUrl });

    alert("Video uploaded successfully!");
    setTitle("");
    setDescription("");
    setVideoUrl(null);
    setUploadProgress(0);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <input
        type="text"
        placeholder="Video Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input input-bordered"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="textarea textarea-bordered"
        required
      />

      {/* Reusable uploader */}
      <FileUpload
        fileType="video"
        onSuccess={handleSuccess}
        onProgress={handleProgress}
      />

      {uploadProgress > 0 && uploadProgress < 100 && (
        <progress
          value={uploadProgress}
          max="100"
          className="progress progress-primary w-full"
        />
      )}

      {videoUrl && (
        <p className="text-green-600 text-sm">Uploaded successfully ✅</p>
      )}

      <button className="btn btn-primary" disabled={!videoUrl}>
        Submit Video
      </button>
    </form>
  );
}
