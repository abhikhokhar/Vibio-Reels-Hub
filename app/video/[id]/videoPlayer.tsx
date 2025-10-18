"use client";
import { IKVideo } from "imagekitio-next";

export default function VideoPlayer({ path }: { path: string }) {
  return (
    <IKVideo
      urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT!}
      path={path}
      transformation={[{ height: "1920", width: "1080" }]}
      controls
      autoPlay
      playsInline
      loop
      muted={false}
      className="w-full h-full object-cover"
    />
  );
}
