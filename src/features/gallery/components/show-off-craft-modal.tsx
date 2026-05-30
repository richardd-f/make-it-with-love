"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/src/components/UploadButton";
import { createGalleryPost } from "../actions/create-gallery-post.action";

interface ShowOffCraftModalProps {
  courseId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShowOffCraftModal({ courseId, isOpen, onClose }: ShowOffCraftModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleUploadSuccess = (url: string) => {
    const detected: "image" | "video" = url.includes("/video/upload/") ? "video" : "image";
    setMediaUrl(url);
    setMediaType(detected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl || !title.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const result = await createGalleryPost(courseId, title.trim(), caption.trim(), mediaUrl, mediaType);

    if (!result.success) {
      setError(result.error ?? "Something went wrong.");
      setIsSubmitting(false);
      return;
    }

    router.refresh();
    handleClose();
  };

  const handleClose = () => {
    setMediaUrl(null);
    setTitle("");
    setCaption("");
    setError(null);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen || !mounted) return null;

  const canSubmit = !!mediaUrl && title.trim().length > 0 && !isSubmitting;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8">
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal card */}
      <div
        className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
        style={{ animation: "modalZoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-gray-600 p-2 rounded-full shadow-sm transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#ea7c9d] to-[#f79d1c] px-8 pt-8 pb-6">
          <h2 className="font-family-papernotes text-4xl text-white drop-shadow-sm">Show Off Your Craft!</h2>
          <p className="text-white/80 text-sm mt-1" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
            Share your amazing creation with the world
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-8">

          {/* Upload area */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
              Photo or Video <span className="text-[#ea7c9d]">*</span>
            </label>

            {mediaUrl ? (
              <div className="relative w-full rounded-2xl overflow-hidden bg-gray-100 border-2 border-[#32a569]">
                {mediaType === "video" ? (
                  <video src={mediaUrl} controls className="w-full max-h-52 object-contain" />
                ) : (
                  <img src={mediaUrl} alt="preview" className="w-full max-h-52 object-contain p-2" />
                )}
                <button
                  type="button"
                  onClick={() => setMediaUrl(null)}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-600 p-1.5 rounded-full shadow text-xs font-bold transition-colors"
                  style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
                >
                  Change
                </button>
              </div>
            ) : (
              <UploadButton
                options={{ sources: ["local", "url"], resourceType: "auto", multiple: false }}
                onSuccess={handleUploadSuccess}
              >
                {({ open, isLoading }) => (
                  <button
                    type="button"
                    onClick={open}
                    disabled={isLoading}
                    className="w-full py-10 rounded-2xl border-2 border-dashed border-[#f6e5c4] bg-[#f6e5c4]/20 hover:bg-[#f6e5c4]/40 hover:border-[#f79d1c] transition-all flex flex-col items-center gap-3 text-gray-500"
                  >
                    {isLoading ? (
                      <div className="w-8 h-8 border-4 border-[#ea7c9d] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ea7c9d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span className="font-semibold text-[#ea7c9d]" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
                          Upload photo or video
                        </span>
                        <span className="text-xs text-gray-400" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
                          JPG, PNG, MP4, MOV supported
                        </span>
                      </>
                    )}
                  </button>
                )}
              </UploadButton>
            )}
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
              Title <span className="text-[#ea7c9d]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My Amazing Paper Crane"
              maxLength={80}
              className="w-full px-5 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-[#ea7c9d] focus:ring-4 focus:ring-[#ea7c9d]/20 transition-all text-gray-800"
              style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
            />
          </div>

          {/* Caption */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
              Caption <span className="text-gray-400 normal-case font-normal text-xs">(optional)</span>
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Tell us about your creation..."
              rows={3}
              maxLength={300}
              className="w-full px-5 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-[#ea7c9d] focus:ring-4 focus:ring-[#ea7c9d]/20 transition-all resize-none text-gray-800"
              style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
            />
          </div>

          {error && (
            <p className="text-sm text-[#e4552c] font-medium" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-4 rounded-2xl font-bold text-lg text-white transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: "var(--font-montserrat, Montserrat, sans-serif)",
              background: canSubmit ? "linear-gradient(135deg, #ea7c9d, #f79d1c)" : "#d1d5db",
            }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Posting...
              </span>
            ) : (
              "Share My Craft! 🎨"
            )}
          </button>
        </form>
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
