"use client";

import React from "react";
import { ICourseDetail } from "../interfaces/course.types";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/src/actions/track-event.action";
import { BookZoomButton } from "./book-zoom-button";

export const CourseCtaBox = ({ course }: { course: ICourseDetail }) => {
  const router = useRouter();

  const handleCheckoutNavigation = () => {
    trackEvent("BUY_COURSE_CLICK", course.id);
    // Waitlist or Checkout intent
    alert(`Proceeding to checkout for ${course.title}`);
  };

  const handleLearnNavigation = () => {
    router.push(`/courses/${course.id}/learn`);
  };

  const handleArNavigation = () => {
    trackEvent("TRY_AR_FEATURE_CLICK", course.id);
    alert(`Thank you for your interest! The AR feature for ${course.title} is coming soon.`);
  };

  return (
    <div className="w-full bg-[#32a569] rounded-[2rem] p-8 shadow-2xl sticky top-32 border-4 border-[#fffbe6] text-center flex flex-col gap-6 text-white overflow-hidden active:animate-twitch">

      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none"></div>

      <h3 className="text-3xl font-family-papernotes drop-shadow-md">Course Access</h3>

      {/* Price display if not owned */}
      {!course.isOwned && (
        <div className="flex flex-col items-center justify-center my-4">
          <span className="text-gray-200 text-lg uppercase tracking-widest font-bold mb-1">Total Including Kit</span>
          <span className="text-5xl font-extrabold font-sans drop-shadow-md">
            Rp {course.price.toLocaleString("id-ID")}
          </span>
        </div>
      )}

      {course.isOwned ? (
        <button
          onClick={handleLearnNavigation}
          className="w-full bg-[#f79d1c] hover:bg-[#e68f12] text-white font-bold text-2xl py-5 rounded-full shadow-lg hover:scale-105 transition-all font-family-papernotes uppercase tracking-widest"
        >
          Continue Learning!
        </button>
      ) : course.starterKit.inStock ? (
        <button
          onClick={handleCheckoutNavigation}
          className="w-full bg-white hover:bg-gray-100 text-[#32a569] font-bold text-2xl py-5 rounded-full shadow-lg hover:scale-105 transition-all font-family-papernotes uppercase tracking-widest"
        >
          Buy / Add to Cart
        </button>
      ) : (
        <div className="flex flex-col gap-4">
          <span className="bg-[#e4552c]/20 text-[#fffbe6] py-2 px-4 rounded-xl border border-[#e4552c]/40 font-bold uppercase tracking-widest text-sm">
            Oh no, starter kits are out of stock!
          </span>
          <button
            onClick={() => alert("Added to Waitlist!")}
            className="w-full bg-[#ea7c9d] hover:bg-[#d86b8b] text-white font-bold text-2xl py-5 rounded-full shadow-lg hover:scale-105 transition-all font-family-papernotes uppercase tracking-widest"
          >
            Join Waitlist
          </button>
        </div>
      )}

      {/* Book Zoom button for non-enrolled users */}
      {!course.isOwned && (
        <BookZoomButton courseId={course.id} courseTitle={course.title} />
      )}

      {/* Test / MVP Buttons */}
      <div className="flex flex-col gap-3 mt-4 pt-6 border-t-2 border-white/20">
        <span className="text-sm uppercase tracking-widest font-bold opacity-80">Test Features</span>

        {/* Test Access Button */}
        {!course.isOwned && (
          <button
            onClick={handleLearnNavigation}
            className="w-full bg-[#f6e5c4] hover:bg-[#e8d2a6] text-[#32a569] font-bold text-xl py-4 rounded-full shadow-lg hover:scale-105 transition-all font-family-papernotes uppercase tracking-wide"
          >
            Try Course (Test Access)
          </button>
        )}

        {/* Try AR Feature Button */}
        <button
          onClick={handleArNavigation}
          className="w-full bg-[#32a569] hover:bg-[#288a56] text-white border-2 border-white font-bold text-xl py-4 rounded-full shadow-lg hover:scale-105 transition-all font-family-papernotes uppercase tracking-wide flex items-center justify-center gap-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
            <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
            <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          Try AR Feature!
        </button>
      </div>

      <div className="text-center mt-2 opacity-80 text-sm flex items-center justify-center gap-2">
        <span>30-Day Happiness Guarantee</span>
      </div>
    </div>
  );
};
