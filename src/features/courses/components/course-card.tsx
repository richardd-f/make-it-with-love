"use client";

import React from "react";
import { ICourse } from "../interfaces/course.types";

export const CourseCard = ({ course }: { course: ICourse }) => {
  const idrFormattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(course.price);

  return (
    <div className="group flex flex-col md:flex-row bg-white rounded-[3rem] shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer w-full relative z-10 border-4 border-white/50">
      {/* Image Section */}
      <div className="relative w-full md:w-5/12 h-72 md:h-auto shrink-0 overflow-hidden bg-gradient-to-br from-[#f6e5c4] to-[#f79d1c]/20">
        <div className="absolute inset-0 flex items-center justify-center text-[#e4552c] text-3xl font-black opacity-60" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
          {course.category}
        </div>
        
        {course.tags && course.tags.length > 0 && (
          <div className="absolute top-6 left-6 flex gap-2 z-20">
            {course.tags.map(tag => (
              <span key={tag} className="px-5 py-2 text-sm font-black uppercase tracking-wider rounded-full bg-[#f79d1c] text-white shadow-xl" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Fade Out Edge to right (desktop) and down (mobile) */}
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-white z-10 hidden md:block"></div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-transparent to-white z-10 md:hidden"></div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-8 md:p-12 justify-center bg-white z-20 relative">
        <div className="flex justify-between items-start mb-4">
          <span className="px-4 py-1.5 bg-[#ea7c9d]/10 text-[#ea7c9d] rounded-2xl text-xs font-black uppercase tracking-widest" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
            {course.category} • {course.ageRange} yrs
          </span>
        </div>
        
        <h3 className="text-3xl md:text-4xl font-black text-gray-800 mb-3 leading-tight group-hover:text-[#ea7c9d] transition-colors" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
          {course.title}
        </h3>
        
        <p className="text-xl text-gray-500 mb-8 font-bold" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
          Instructor: {course.author}
        </p>

        <div className="mt-auto flex justify-end">
          <span className="text-4xl font-black text-[#32a569]" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>{idrFormattedPrice}</span>
        </div>
      </div>
    </div>
  );
};
