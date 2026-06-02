"use client";

import { useTransition } from "react";
import { toast } from "react-toastify";
import { deleteCourse } from "../actions/courseActions";

export function DeleteCourseButton({ courseId, courseName }: { courseId: string; courseName: string }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Delete &quot;{courseName}&quot;?</p>
          <p className="text-xs text-gray-500">This action cannot be undone.</p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => {
                closeToast?.();
                startTransition(async () => {
                  const result = await deleteCourse(courseId);
                  if (result?.error) {
                    toast.error(result.error);
                  } else {
                    toast.success("Course deleted successfully");
                  }
                });
              }}
              className="px-3 py-1 bg-[#e4552c] hover:bg-[#c93d1e] text-white rounded-full text-xs font-bold transition-colors"
            >
              Delete
            </button>
            <button
              onClick={closeToast}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-bold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false }
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-[#e4552c]/10 text-gray-400 hover:text-[#e4552c] transition-colors disabled:opacity-50 z-10"
      aria-label="Delete course"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
      </svg>
    </button>
  );
}
