"use client";

import React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { IGalleryPost } from "../interfaces/gallery.types";

interface GalleryModalProps {
  post: IGalleryPost | null;
  onClose: () => void;
}

export function GalleryModal({ post, onClose }: GalleryModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!post || !mounted) return null;

  const isVideo = post.mediaType === "video";

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        style={{ animation: "fadeIn 0.2s ease-out forwards" }}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative bg-white w-full max-w-5xl max-h-full rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
        style={{ animation: "modalZoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-sm transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Left Side: Media */}
        <div className="w-full md:w-3/5 bg-gradient-to-br from-[#f6e5c4]/40 to-[#f79d1c]/20 relative min-h-[40vh] md:min-h-[70vh] flex items-center justify-center p-8">
          {isVideo ? (
            <video
              src={post.mediaUrl}
              controls
              autoPlay
              className="w-full h-full max-h-[60vh] object-contain rounded-2xl"
            />
          ) : (
            <Image
              src={post.mediaUrl}
              alt={post.title}
              fill
              className="object-contain mix-blend-multiply drop-shadow-lg"
            />
          )}
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col bg-white overflow-y-auto">

          {/* Author Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-[#ea7c9d]/20 relative border-2 border-[#f6e5c4] shrink-0 shadow-sm flex items-center justify-center">
              {post.authorProfilePic ? (
                <Image
                  src={post.authorProfilePic}
                  alt={post.authorName}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="font-family-papernotes text-2xl text-[#ea7c9d]">
                  {post.authorName.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-xl" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
                {post.authorName}
              </h3>
              <p className="text-gray-400 text-sm" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
                {post.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          <hr className="border-gray-100 mb-8" />

          {/* Title & Description */}
          <h2 className="font-family-papernotes text-4xl text-[#e4552c] mb-6 leading-tight">
            {post.title}
          </h2>

          {post.description && (
            <p className="text-gray-600 text-lg leading-relaxed mb-8 flex-1" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
              {post.description}
            </p>
          )}

          {/* Heart Button */}
          <button className="mt-auto w-full py-4 rounded-2xl bg-[#ea7c9d]/10 text-[#ea7c9d] hover:bg-[#ea7c9d] hover:text-white font-bold text-xl flex justify-center items-center gap-3 transition-colors" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            Love it!
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes modalZoomIn {
            from { opacity: 0; transform: scale(0.95) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `
      }} />
    </div>,
    document.body
  );
}
