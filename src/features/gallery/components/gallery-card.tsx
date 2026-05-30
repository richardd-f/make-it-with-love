"use client";

import React from "react";
import Image from "next/image";
import { IGalleryPost } from "../interfaces/gallery.types";

interface GalleryCardProps {
  post: IGalleryPost;
  onClick: (post: IGalleryPost) => void;
}

export function GalleryCard({ post, onClick }: GalleryCardProps) {
  const hash = post.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const heightClass = hash % 3 === 0 ? "h-64" : hash % 3 === 1 ? "h-80" : "h-96";
  const isVideo = post.mediaType === "video";

  return (
    <div
      onClick={() => onClick(post)}
      className="masonry-item break-inside-avoid mb-6 cursor-pointer group"
    >
      <div className="bg-white rounded-3xl p-3 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#f6e5c4] transform hover:-translate-y-1">

        {/* Media Container */}
        <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden bg-gradient-to-br from-[#f6e5c4]/30 to-[#f79d1c]/10 flex items-center justify-center`}>
          {isVideo ? (
            <>
              <video
                src={post.mediaUrl}
                muted
                playsInline
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300 z-10">
                <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#ea7c9d" className="ml-1">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>
            </>
          ) : (
            <>
              <Image
                src={post.mediaUrl}
                alt={post.title}
                fill
                className="object-contain mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500 p-4"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10" />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 px-2 pb-2">
          <h3 className="font-bold text-gray-800 text-lg line-clamp-1" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
            {post.title}
          </h3>

          <div className="flex items-center gap-2 mt-2">
            {post.authorProfilePic ? (
              <div className="w-6 h-6 rounded-full overflow-hidden bg-[#ea7c9d]/20 relative shrink-0">
                <Image
                  src={post.authorProfilePic}
                  alt={post.authorName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#ea7c9d] to-[#f79d1c] flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">{post.authorName.charAt(0)}</span>
              </div>
            )}
            <span className="text-sm text-gray-500 font-medium truncate" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
              {post.authorName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
