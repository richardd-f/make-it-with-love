"use client";

import React from "react";
import Image from "next/image";
import { IGalleryPost } from "../interfaces/gallery.types";

interface GalleryCardProps {
  post: IGalleryPost;
  onClick: (post: IGalleryPost) => void;
}

export function GalleryCard({ post, onClick }: GalleryCardProps) {
  // Generate a random aspect ratio for the masonry effect to look natural
  // Since our mock images are all squares, we'll force some height variance on the container 
  // to simulate different image sizes in a masonry layout
  
  // Deterministic random based on ID for consistency
  const hash = post.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const heightClass = hash % 3 === 0 ? "h-64" : hash % 3 === 1 ? "h-80" : "h-96";

  return (
    <div 
      onClick={() => onClick(post)}
      className="masonry-item break-inside-avoid mb-6 cursor-pointer group"
    >
      <div className="bg-white rounded-3xl p-3 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#f6e5c4] transform hover:-translate-y-1">
        
        {/* Image Container */}
        <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden bg-gradient-to-br from-[#f6e5c4]/30 to-[#f79d1c]/10 flex items-center justify-center`}>
          <Image 
            src={post.imageUrl} 
            alt={post.title} 
            fill
            className="object-contain mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500 p-4" 
          />
          
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10" />
        </div>

        {/* Footer info */}
        <div className="mt-4 px-2 pb-2">
          <h3 className="font-bold text-gray-800 text-lg line-clamp-1" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
            {post.title}
          </h3>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-[#ea7c9d]/20 relative shrink-0">
              <Image 
                src={post.authorProfilePic} 
                alt={post.authorName}
                fill
                className="object-cover mix-blend-multiply"
              />
            </div>
            <span className="text-sm text-gray-500 font-medium truncate" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
              {post.authorName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
