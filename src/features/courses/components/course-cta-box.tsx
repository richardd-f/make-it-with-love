"use client";

import React from "react";
import { ICourseDetail } from "../interfaces/course.types";
import { useRouter } from "next/navigation";

export const CourseCtaBox = ({ course }: { course: ICourseDetail }) => {
  const router = useRouter();

  const handleCheckoutNavigation = () => {
    // Waitlist or Checkout intent
    alert(`Proceeding to checkout for ${course.title}`);
  };

  const handleLearnNavigation = () => {
    router.push(`/courses/${course.id}/learn`);
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

      <div className="text-center mt-2 opacity-80 text-sm flex items-center justify-center gap-2">
        <span>30-Day Happiness Guarantee</span>
      </div>
    </div>
  );
};
