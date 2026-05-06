"use client";

import React, { useState } from "react";
import { IGalleryPost } from "../interfaces/gallery.types";
import { GalleryCard } from "./gallery-card";
import { GalleryModal } from "./gallery-modal";

interface MasonryGridProps {
  posts: IGalleryPost[];
}

export function MasonryGrid({ posts }: MasonryGridProps) {
  const [selectedPost, setSelectedPost] = useState<IGalleryPost | null>(null);

  if (posts.length === 0) {
    return (
      <div className="w-full bg-white/50 backdrop-blur-md rounded-[3rem] p-16 text-center border-4 border-dashed border-[#f6e5c4]">
        <h3 className="font-family-papernotes text-4xl text-[#e4552c] mb-4">No Crafts Yet!</h3>
        <p className="text-xl text-gray-500 font-medium" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
          Be the first to share your masterpiece with the world.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {posts.map(post => (
            <GalleryCard 
              key={post.id} 
              post={post} 
              onClick={setSelectedPost} 
            />
          ))}
        </div>
      </div>

      <GalleryModal 
        post={selectedPost} 
        onClose={() => setSelectedPost(null)} 
      />
    </>
  );
}
