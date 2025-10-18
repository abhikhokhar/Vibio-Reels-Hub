// app/page.tsx (Server Component)
import { IVideo } from "@/models/Video";
import VideoFeedClient from "./components/VideoFeedClient"; // ✅ new client component

async function getVideos(): Promise<IVideo[]> {
  const res = await fetch(`http://localhost:3000/api/video`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch videos");
    return [];
  }

  const data = await res.json();
  console.log("Fetched videos:", data);
  return data;
}

export default async function HomePage() {
  const videos = await getVideos();

  return (
    // ✅ Pass videos as props to a client component
    <div className="bg-background text-foreground transition-colors duration-300">
    <VideoFeedClient videos={videos} />
    </div>
  );
}
