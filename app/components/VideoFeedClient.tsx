// components/VideoFeedClient.tsx
"use client";

import { IVideo } from "@/models/Video";
import VideoFeed from "./VideoFeed"; // if it's also client-side or presentation

interface Props {
  videos: IVideo[];
}

export default function VideoFeedClient({ videos }: Props) {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Latest Videos</h1>
      <VideoFeed videos={videos} />
    </main>
  );
}
