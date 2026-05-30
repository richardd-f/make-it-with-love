"use client";

import { useRouter } from "next/navigation";
import { markVideoWatched } from "../actions/mark-video-watched.action";

interface VideoPlayerProps {
  videoUrl: string;
  posterUrl: string;
  videoId: string;
}

export function VideoPlayer({ videoUrl, posterUrl, videoId }: VideoPlayerProps) {
  const router = useRouter();

  const handleEnded = async () => {
    await markVideoWatched(videoId);
    router.refresh();
  };

  return (
    <video
      className="w-full h-full object-cover"
      controls
      poster={posterUrl}
      onEnded={handleEnded}
    >
      <source src={videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
