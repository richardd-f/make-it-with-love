"use client";

import { trackEvent } from "@/src/actions/track-event.action";

export function AddPostButton({ courseId }: { courseId: string }) {
  const handleClick = () => {
    trackEvent("GALLERY_ADD_IMAGE_CLICK", `courseId:${courseId}`);
    alert("Coming soon! You'll be able to post your craft here.");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-8 left-8 z-50 bg-[#32a569] hover:bg-[#288a56] text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 group"
      title="Submit your craft!"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-hover:rotate-90 transition-transform duration-300"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>

      {/* Tooltip */}
      <div
        className="absolute left-20 top-1/2 -translate-y-1/2 bg-white text-[#32a569] font-bold px-4 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
        style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
      >
        Post your craft!
      </div>
    </button>
  );
}
