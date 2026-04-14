"use client";

import React, { useState } from "react";
import { IReview } from "../interfaces/course.types";

export const CourseReviews = ({ reviews, isOwned }: { reviews: IReview[], isOwned: boolean }) => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Review submitted! You earned 100 Fun Points!");
  };

  return (
    <div className="w-full bg-[#f6e5c4]/30 rounded-[2rem] p-8 sm:p-10 mb-12">
      <h3 className="text-4xl text-gray-800 font-family-papernotes mb-8 flex items-center gap-4">
        <span className="w-12 h-12 bg-[#f79d1c] rounded-2xl flex items-center justify-center text-white text-2xl -rotate-6"></span>
        Happy Creators Reviews
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {reviews.map(review => (
          <div key={review.id} className="bg-white p-8 rounded-3xl shadow-md border-2 border-white hover:border-[#f79d1c] relative flex flex-col justify-between cursor-pointer active:scale-[0.98] active:-rotate-1 transition-all duration-200">
            {/* User Avatar & Name */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#ea7c9d] to-[#e4552c] rounded-full shadow-sm text-center flex items-center justify-center font-family-papernotes text-2xl text-white">
                {review.userName.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-800 font-sans text-lg">{review.userName}</span>
                <span className="text-sm text-gray-400 font-medium">{review.createdAt}</span>
              </div>
            </div>

            <p className="text-gray-600 font-sans italic mb-6">&quot;{review.text}&quot;</p>

            {/* Render random result image if present */}
            {review.resultImageUrl && (
              <div className="w-full h-32 rounded-xl overflow-hidden mb-6 bg-gray-100 flex items-center justify-center border-4 border-[#fffbe6]">
                <img src={review.resultImageUrl} alt="Masterpiece" className="h-full object-contain mix-blend-multiply drop-shadow-md" />
              </div>
            )}

            {/* Stars rendering */}
            <div className="flex gap-1 mt-auto">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-6 h-6 ${i < review.rating ? 'text-[#f79d1c] fill-current drop-shadow-sm' : 'text-gray-300'}`} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Review Submission Form - Simulated as gated internally by course completion, here we mock it with isOwned */}
      {isOwned && (
        <div className="w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border-4 border-[#ea7c9d] relative overflow-hidden active:animate-twitch">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ea7c9d]/10 rounded-bl-[100px] pointer-events-none"></div>

          <h4 className="text-3xl font-family-papernotes text-[#ea7c9d] mb-4">Share your masterpiece!</h4>
          <p className="text-gray-600 mb-8 font-sans font-medium">You bought this course! Let others know how fun it was.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`w-10 h-10 transition-transform ${star <= rating ? 'text-[#f79d1c] hover:scale-125' : 'text-gray-200 hover:text-[#f79d1c]'}`}
                >
                  <svg className="w-full h-full fill-current drop-shadow-sm" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                </button>
              ))}
            </div>

            <textarea
              className="w-full h-32 p-6 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:outline-none focus:border-[#ea7c9d] focus:ring-4 focus:ring-[#ea7c9d]/20 transition-all resize-none font-sans font-medium text-lg placeholder:text-gray-400"
              placeholder="Tell us what you loved creating..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            ></textarea>

            <button type="submit" className="self-start px-8 py-4 bg-[#ea7c9d] text-white font-bold rounded-full text-xl hover:bg-[#d86689] hover:scale-105 transition-all shadow-lg font-family-papernotes uppercase tracking-widest">
              Submit Review
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
