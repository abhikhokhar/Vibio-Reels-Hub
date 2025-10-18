import { IVideo } from "@/models/Video";
import { notFound } from "next/navigation";
import VideoPlayer from "./videoPlayer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function getVideo(id: string): Promise<IVideo | null> {
  const res = await fetch(`http://localhost:3000/api/video/${id}`, {
    cache: "no-store",
    headers: {
      Cookie: (await import("next/headers")).cookies().toString(),
    },
  });
  if (!res.ok) return null;
  return await res.json();
}

export default async function VideoPage({ params }: { params: { id: string } }) {
  const video = await getVideo(params.id);
  if (!video) return notFound();

  return (
  <main className="flex flex-col items-center justify-center w-full min-h-screen overflow-hidden relative">
  {/* Video Title */}
  <h1 className="text-2xl py-4 font-semibold tracking-wide">{video.title}</h1>

  {/* Reel Container */}
  <div className="relative aspect-[9/16] w-full max-w-sm sm:w-96 overflow-hidden rounded-2xl shadow-2xl border border-white/10">
    {/* Video */}
    <div className="relative z-0">
      <VideoPlayer path={video.videoUrl} />
    </div>

    {/* Floating Back Button */}
    <Link
      href="/"
      className="absolute top-6 left-6 flex items-center z-20 bg-black/40 hover:bg-black/60 p-2 rounded-full transition"
    >
      <ArrowLeft className="w-6 h-6 text-white" />
    </Link>

    {/* Gradient Overlay for text readability */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />

    {/* Overlay Text Info */}
    <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
      <p className="text-sm mt-1 text-gray-200">{video.description}</p>
    </div>
  </div>
</main>

  );
}
