"use client";

import { trackEvent } from "@/src/actions/track-event.action";

export function BookZoomButton({ courseId, courseTitle }: { courseId: string; courseTitle: string }) {
  const handleClick = async () => {
    await trackEvent("BOOK_ZOOM_MEETING_CLICK", `courseId:${courseId}`);
    alert(`Thank you for your interest in a live Zoom session for "${courseTitle}"! We'll be in touch soon. 🎉`);
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 bg-[#f79d1c] hover:bg-[#e4552c] text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 whitespace-nowrap"
      style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.899L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
      </svg>
      Book Zoom
    </button>
  );
}
