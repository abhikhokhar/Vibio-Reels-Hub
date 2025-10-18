"use client";

import { IKVideo } from "imagekitio-next";
import Link from "next/link";
import { IVideo } from "@/models/Video";
import { PlayCircle } from "lucide-react";

export default function VideoComponent({ video }: { video: IVideo }) {
  return (
    <div className="group flex flex-col h-full">
      {/* --- Video Thumbnail with Enhanced Hover Effect --- */}
      <div className="relative rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
        <Link href={`/video/${video._id}`} className="relative block h-full">
          {/* Aspect ratio changed to 4:5 for a shorter, modern portrait look */}
          <div className="w-full aspect-[4/5] bg-base-300">
            <IKVideo
              urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT!}
              path={video.videoUrl}
              // Transformation updated to match the 4:5 aspect ratio
              transformation={[{ height: "1080", width: "864" }]}
              controls={video.controls}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          {/* Enhanced Hover Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"></div>
            <PlayCircle className="w-16 h-16 text-white/90 z-10" />
          </div>
        </Link>
      </div>

      {/* --- Video Title & Description --- */}
      <div className="mt-4 flex-shrink-0">
        <Link href={`/video/${video._id}`}>
          <h3 className="font-bold text-lg text-base-content leading-tight line-clamp-2 hover:text-purple-600 transition-colors">
            {video.title}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-base-content/70 line-clamp-3">
          {video.description}
        </p>
      </div>
    </div>
  );
}