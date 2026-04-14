"use client";

import React, { useState } from "react";
import { ICourseDetail } from "../interfaces/course.types";
import { toggleWishlist } from "../actions/wishlist.action";

export const CourseHero = ({ course }: { course: ICourseDetail }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleLove = async () => {
    setIsWishlisted(!isWishlisted);
    await toggleWishlist(course.id);
  };

  return (
    <div className="w-full bg-white rounded-[3rem] p-6 sm:p-10 shadow-2xl relative z-10 border-[6px] border-[#f6e5c4] mb-12 active:animate-twitch">
      <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 items-center xl:items-stretch">
        
        {/* Left Side: Video/Thumbnail */}
        <div className="w-full xl:w-1/2 flex-shrink-0 relative rounded-[2rem] overflow-hidden shadow-inner bg-[#fffbe6] cursor-pointer">
          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-contain mix-blend-multiply opacity-80 min-h-[300px]" />
          {/* Fun Decors */}
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            {course.tags?.map(tag => (
              <span key={tag} className="px-5 py-2 text-sm uppercase tracking-wider rounded-full bg-[#e4552c] text-white shadow-md font-bold" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex flex-col justify-center w-full xl:w-1/2 gap-6 relative">
          <div className="flex justify-between items-start">
             <span className="px-4 py-1.5 bg-[#ea7c9d]/10 text-[#ea7c9d] rounded-2xl text-xs uppercase tracking-widest border border-[#ea7c9d]/20 font-bold" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
              {course.category} • {course.ageRange} yrs
            </span>
             
             <div className="flex gap-4">
                <button onClick={handleLove} className={`p-4 rounded-full transition-all shadow-md hover:scale-110 ${isWishlisted ? 'bg-[#ea7c9d] text-white' : 'bg-gray-100 text-gray-400 hover:text-[#ea7c9d]'}`}>
                  <svg className="w-6 h-6" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </button>
                <button onClick={() => setIsShareOpen(true)} className="p-4 rounded-full bg-gray-100 text-gray-500 hover:bg-[#f79d1c] hover:text-white transition-all shadow-md hover:scale-110">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                </button>
             </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl text-gray-800 leading-[1.1] font-family-papernotes">
            {course.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
            <span className="text-lg sm:text-xl text-gray-600 uppercase tracking-widest font-bold">BY {course.author}</span>
            <div className="flex items-center gap-2">
               <svg className="w-6 h-6 text-[#f79d1c] fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
               <span className="text-lg sm:text-xl font-bold text-gray-800">{course.rating}</span>
               <span className="text-gray-400">({course.totalReviews})</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
               <span>{course.totalStudents} enrolled</span>
            </div>
          </div>

          <p className="text-lg text-gray-600 leading-relaxed font-normal" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
            {course.description}
          </p>

        </div>
      </div>

      {/* Share Modal Background */}
      {isShareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           {/* Blurry background */}
           <div className="absolute inset-0 bg-white/40 backdrop-blur-md" onClick={() => setIsShareOpen(false)}></div>
           {/* Modal Body */}
           <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl border-4 border-[#32a569] animate-fade-in flex flex-col items-center text-center gap-6">
              <h3 className="font-family-papernotes text-4xl text-[#32a569]">Share the Joy! 🌟</h3>
              <p className="text-gray-600 font-normal">Copy this funny link to invite your friends over!</p>
              <div className="w-full bg-gray-100 p-4 rounded-xl flex items-center justify-between border-2 border-dashed border-gray-300">
                 <span className="text-gray-500 truncate w-3/4 font-mono text-sm">https://miwl.com/c/{course.id}</span>
                 <button onClick={() => { navigator.clipboard.writeText(`https://miwl.com/c/${course.id}`); setIsShareOpen(false); }} className="text-[#ea7c9d] font-bold hover:scale-110 transition-all font-sans tracking-widest">COPY</button>
              </div>
              <button onClick={() => setIsShareOpen(false)} className="px-8 py-3 bg-gray-200 rounded-full font-bold text-gray-600 hover:bg-gray-300 transition-colors uppercase tracking-widest">Close</button>
           </div>
        </div>
      )}
    </div>
  );
};
