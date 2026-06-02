"use client";

import { useState } from "react";
import { ShowOffCraftModal } from "./show-off-craft-modal";

export function ShowOffCraftInlineButton({ courseId }: { courseId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-2 bg-[#32a569] hover:bg-[#288a56] text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 whitespace-nowrap"
        style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
          <line x1="12" y1="9" x2="12" y2="15" />
          <line x1="9" y1="12" x2="15" y2="12" />
        </svg>
        Show Off
      </button>

      <ShowOffCraftModal
        courseId={courseId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
