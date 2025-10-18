import { IVideo } from "@/models/Video";
import { notFound } from "next/navigation";
import VideoPlayer from "./videoPlayer";

async function getVideo(id: string): Promise<IVideo | null> {
  const res = await fetch(`http://localhost:3000/api/video/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return await res.json();
}

export default async function VideoPage({ params }: { params: { id: string } }) {
  const video = await getVideo(params.id);
  if (!video) return notFound();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-base-200">
      <div className="max-w-3xl w-full bg-base-100 rounded-xl shadow-lg p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">{video.title}</h1>
        <div
          className="rounded-xl overflow-hidden mx-auto"
          style={{ aspectRatio: "9/16", maxWidth: "500px" }}
        >
          <VideoPlayer path={video.videoUrl} />
        </div>
        <p className="mt-4 text-base-content/80 text-center">
          {video.description}
        </p>
      </div>
    </main>
  );
}
