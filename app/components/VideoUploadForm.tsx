"use client";

import { useState } from "react";
import FileUpload from "./fileUpload";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";

export default function VideoUploadForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle successful upload from FileUpload
  const handleSuccess = (response: any) => {
    // Example: response.filePath or response.url (depends on your uploader)
    setVideoUrl(response.filePath || response.url);
  };

  const handleProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) return alert("Please upload a video first");

    setLoading(true);

    try {
      // Save video info to database
      const response = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          videoUrl,
          controls: true,
          transformation: {
            height: 1920,
            width: 1080,
            quality: 100,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from backend:", errorData);
        alert(`Upload failed: ${errorData.error || "Unknown error"}`);
        return;
      }

      console.log("✅ Video uploaded successfully!");
      alert("Video uploaded successfully!");

      // Reset fields
      setTitle("");
      setDescription("");
      setVideoUrl(null);
      setUploadProgress(0);

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Error submitting video:", error);
      alert("Something went wrong while uploading the video.");
    } finally {
      setLoading(false);
    }
  };

  return (
   <form
  onSubmit={handleSubmit}
  className="flex flex-col gap-5 w-full max-w-md mx-auto p-8 rounded-2xl border border-gray-300/40 shadow-lg backdrop-blur-sm transition-all duration-300"
>
  {/* Title */}
  <h2 className="text-3xl font-semibold text-center tracking-tight mb-2">
    Upload a <span className="text-purple-600">Video</span>
  </h2>


  {/* Video Title */}
  <div className="flex flex-col gap-2">
    <label className="font-medium text-sm">Title</label>
    <input
      type="text"
      placeholder="Enter video title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none px-4 py-2 placeholder-gray-400"
      required
    />
  </div>

  {/* Video Description */}
  <div className="flex flex-col gap-2">
    <label className="font-medium text-sm">Description</label>
    <textarea
      placeholder="Write a short description..."
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none px-4 py-2 placeholder-gray-400 min-h-[90px]"
      required
    />
  </div>

  {/* File Upload */}
  <div className="mt-2">
    <Upload className="inline-block w-5 h-5 text-purple-600 mr-2" />
    <FileUpload
      fileType="video"
      onSuccess={handleSuccess}
      onProgress={handleProgress}
    />
  </div>

  {/* Progress Bar */}
  {uploadProgress > 0 && uploadProgress < 100 && (
    <div className="mt-3">
      <progress
        value={uploadProgress}
        max="100"
        className="progress progress-primary w-full"
      />
      <p className="text-xs text-center mt-1 text-gray-500">
        Uploading {uploadProgress.toFixed(0)}%
      </p>
    </div>
  )}

  {/* Success Message */}
  {videoUrl && (
    <p className="text-green-600 text-center text-sm font-medium mt-2">
      ✅ Video uploaded successfully
    </p>
  )}

  {/* Submit Button */}
  <button
    type="submit"
    disabled={!videoUrl || loading}
    className="w-full bg-purple-600 text-white font-medium py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {loading ? "Uploading..." : "Submit Video"}
  </button>
</form>

  );
}
