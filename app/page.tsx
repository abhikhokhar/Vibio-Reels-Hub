import { cookies } from "next/headers";
import { IVideo } from "@/models/Video";
import VideoFeedClient from "./components/VideoFeedClient";

async function getVideos(): Promise<IVideo[]> {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/video`, {
    cache: "no-store",
    headers: {
      Cookie: cookieString,
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
