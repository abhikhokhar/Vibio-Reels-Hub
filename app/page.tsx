import { cookies } from "next/headers";
import { IVideo } from "@/models/Video";
import VideoFeedClient from "./components/VideoFeedClient";

async function getVideos(): Promise<IVideo[]> {
  const res = await fetch(`http://localhost:3000/api/video`, {
    cache: "no-store",
    headers: {
      Cookie: cookies().toString(),
    },
  });

  if (!res.ok) {
    console.log("Failed to fetch videos");
    return [];
  }

  return res.json();
}

export default async function HomePage() {
  const videos = await getVideos();

  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      <VideoFeedClient videos={videos} />
    </div>
  );
}
