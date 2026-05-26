"use client";

import React, { useTransition } from "react";
import { ICourseDetail } from "../interfaces/course.types";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/src/actions/track-event.action";
import { BookZoomButton } from "./book-zoom-button";
import { claimCourse } from "../actions/claim-course.action";
import { addToCart } from "@/src/features/cart/actions/add-to-cart.action";
import { toast } from "react-toastify";

export const CourseCtaBox = ({ course }: { course: ICourseDetail }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = () => {
    trackEvent("BUY_COURSE_CLICK", course.id);
    startTransition(async () => {
      const result = await addToCart(course.id);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      if (result.alreadyInCart) {
        toast.info("Already in your cart!");
        router.push("/cart");
        return;
      }
      toast.success("Added to cart!");
    });
  };

  const handleLearnNavigation = () => {
    router.push(`/courses/${course.id}/learn`);
  };

  const handleClaim = () => {
    startTransition(async () => {
      const result = await claimCourse(course.id);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="w-full bg-[#32a569] rounded-[2rem] p-8 shadow-2xl sticky top-32 border-4 border-[#fffbe6] text-center flex flex-col gap-6 text-white overflow-hidden active:animate-twitch">

      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none"></div>

      <h3 className="text-3xl font-family-papernotes drop-shadow-md">Course Access</h3>

      {!course.isOwned && (
        <div className="flex flex-col items-center justify-center my-4">
          <span className="text-gray-200 text-lg uppercase tracking-widest font-bold mb-1">Total Including Kit</span>
          <span className="text-5xl font-extrabold font-sans drop-shadow-md">
            Rp {course.price.toLocaleString("id-ID")}
          </span>
        </div>
      )}

      {/* Subscription meeting quota display for enrolled users */}
      {course.isOwned && (
        <div className="flex flex-col gap-2 text-sm bg-white/10 rounded-2xl p-4">
          {course.meetingsAmountLeft !== undefined && (
            <div className="flex justify-between">
              <span>Course meetings left</span>
              <span className="font-bold">{course.meetingsAmountLeft}</span>
            </div>
          )}
          {course.subscriptionMeetingsLeft !== undefined && (
            <div className="flex justify-between">
              <span>Subscription meetings left</span>
              <span className="font-bold">{course.subscriptionMeetingsLeft}</span>
            </div>
          )}
        </div>
      )}

      {course.isOwned ? (
        <div className="flex flex-col gap-3">
          <button
            onClick={handleLearnNavigation}
            className="w-full bg-[#f79d1c] hover:bg-[#e68f12] text-white font-bold text-2xl py-5 rounded-full shadow-lg hover:scale-105 transition-all font-family-papernotes uppercase tracking-widest"
          >
            Start Learning →
          </button>
          <a
            href={`/courses/${course.id}/schedule`}
            className="w-full border-2 border-white/40 hover:border-white text-white font-bold text-lg py-3 rounded-full transition-all font-family-papernotes uppercase tracking-widest text-center block"
          >
            Book a Meeting
          </a>
        </div>
      ) : course.isSubscribed && !course.canClaim ? (
        <button
          onClick={handleLearnNavigation}
          className="w-full bg-[#f79d1c] hover:bg-[#e68f12] text-white font-bold text-2xl py-5 rounded-full shadow-lg hover:scale-105 transition-all font-family-papernotes uppercase tracking-widest"
        >
          Start Learning!
        </button>
      ) : course.canClaim ? (
        <div className="flex flex-col gap-3">
          <button
            onClick={handleClaim}
            disabled={isPending}
            className="w-full bg-[#ea7c9d] hover:bg-[#d86b8b] text-white font-bold text-2xl py-5 rounded-full shadow-lg hover:scale-105 transition-all font-family-papernotes uppercase tracking-widest disabled:opacity-60 disabled:hover:scale-100"
          >
            {isPending ? "Claiming…" : `Claim Free (${course.coursesClaimedLeft} left)`}
          </button>
          <p className="text-white/70 text-xs">
            Your subscription covers courses up to Rp 90,000
          </p>
        </div>
      ) : course.starterKit.inStock ? (
        <button
          onClick={handleAddToCart}
          disabled={isPending}
          className="w-full bg-white hover:bg-gray-100 text-[#32a569] font-bold text-2xl py-5 rounded-full shadow-lg hover:scale-105 transition-all font-family-papernotes uppercase tracking-widest disabled:opacity-60 disabled:hover:scale-100"
        >
          {isPending ? "Adding…" : "Add to Cart"}
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

      {!course.isOwned && (
        <BookZoomButton courseId={course.id} courseTitle={course.title} />
      )}

      <div className="text-center mt-2 opacity-80 text-sm flex items-center justify-center gap-2">
        <span>30-Day Happiness Guarantee</span>
      </div>
    </div>
  );
};
