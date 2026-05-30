"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IGalleryPost } from "../interfaces/gallery.types";
import { GalleryModal } from "./gallery-modal";

interface CourseGalleryPreviewProps {
  posts: IGalleryPost[];
  courseId: string;
}

export function CourseGalleryPreview({ posts, courseId }: CourseGalleryPreviewProps) {
  const [selectedPost, setSelectedPost] = useState<IGalleryPost | null>(null);

  if (!posts || posts.length === 0) return null;

  return (
    <div className="w-full bg-[#f6e5c4]/30 rounded-[2rem] p-8 sm:p-10 mb-12">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <h3 className="text-4xl text-gray-800 font-family-papernotes flex items-center gap-4">
          <span className="w-12 h-12 bg-[#ea7c9d] rounded-2xl flex items-center justify-center text-white text-2xl -rotate-6"></span>
          Student&apos;s Gallery
        </h3>
        <Link 
          href={`/courses/${courseId}/gallery`}
          className="px-6 py-3 bg-white text-[#ea7c9d] border-2 border-[#ea7c9d] hover:bg-[#ea7c9d] hover:text-white rounded-full font-bold transition-colors"
          style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
        >
          See Student Gallery
        </Link>
      </div>

      {/* Lazy Row Container */}
      <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory hide-scrollbar">
        {posts.map((post) => (
          <div 
            key={post.id} 
            onClick={() => setSelectedPost(post)}
            className="snap-start shrink-0 w-[280px] bg-white rounded-3xl p-3 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#f79d1c] cursor-pointer group flex flex-col"
          >
            {/* Media Container */}
            <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-[#f6e5c4]/30 to-[#f79d1c]/10 flex items-center justify-center mb-4">
              {post.mediaType === "video" ? (
                <>
                  <video src={post.mediaUrl} muted playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                    <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#ea7c9d" className="ml-0.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Image
                    src={post.mediaUrl}
                    alt={post.title}
                    fill
                    className="object-contain mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500 p-2"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10" />
                </>
              )}
            </div>

            {/* Footer info */}
            <div className="px-2 pb-2 mt-auto">
              <h4 className="font-bold text-gray-800 text-lg line-clamp-1 mb-2" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
                {post.title}
              </h4>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-[#ea7c9d]/20 relative shrink-0 flex items-center justify-center">
                    {post.authorProfilePic ? (
                      <Image src={post.authorProfilePic} alt={post.authorName} fill className="object-cover" />
                    ) : (
                      <span className="text-white text-xs font-bold">{post.authorName.charAt(0)}</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 font-medium truncate" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
                    {post.authorName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      <GalleryModal 
        post={selectedPost} 
        onClose={() => setSelectedPost(null)} 
      />
    </div>
  );
}
