"use client";

import { IVideo } from "@/models/Video";
import VideoFeed from "./VideoFeed";
import Link from "next/link";
import { Upload } from "lucide-react";
import { useNotification } from "./Notification";

interface Props {
  videos: IVideo[];
}

export default function VideoFeedClient({ videos }: Props) {
  const { showNotification } = useNotification();

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {videos.length > 0 ? "Your Videos" : "No Videos Available"}
        </h1>

        <Link
          href="/upload"
          className="flex items-center gap-2 text-sm font-medium hover:text-purple-600 transition-colors"
          onClick={() => showNotification("Upload your video 🎥", "info")}
        >
          <Upload className="w-5 h-5 text-purple-600" />
        </Link>
      </div>

      <VideoFeed videos={videos} />
    </main>
  );
}
