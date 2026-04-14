"use client";

import React, { useMemo } from "react";
import { ICourse } from "../interfaces/course.types";

const DECOR_IMAGES = [
  "circle_green.webp", "circle_orange.webp", "circle_pink.webp", "circle_red.webp", "circle_yellow.webp",
  "coral1_green.webp", "coral1_orange.webp", "coral1_pink.webp", "coral1_red.webp",
  "coral2_green.webp", "coral2_orange.webp", "coral2_pink.webp", "coral2_red.webp"
];

function mulberry32(a: number) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export const CourseCard = ({ course, index }: { course: ICourse; index: number }) => {

  const decors = useMemo(() => {
    // Generate deterministic random decorators based on ID
    const random = mulberry32(parseInt(course.id) + 12345);
    const count = 2 + Math.floor(random() * 2); // 2 or 3 decorators
    const arr = [];
    for(let i=0; i<count; i++) {
      const decorIndex = Math.floor(random() * DECOR_IMAGES.length);
      arr.push({
        src: `/images/assets/${DECOR_IMAGES[decorIndex]}`,
        top: Math.floor(random() * 80) + 10,
        left: Math.floor(random() * 80) + 10,
        size: Math.floor(random() * 40) + 40,
        rotation: Math.floor(random() * 360)
      });
    }
    return arr;
  }, [course.id]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:`
        .card-shine::before {
          content: '';
          position: absolute;
          top: 0; left: -150%; width: 100%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(234,124,157,0.3), transparent);
          transform: skewX(-20deg);
          z-index: 50;
          pointer-events: none;
          transition: none;
        }
        .group:hover .card-shine::before { 
          left: 150%; 
          transition: left 0.7s ease-in-out;
        }
      `}} />

      <div className="card-shine group flex flex-col md:flex-row bg-white rounded-[3rem] shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden cursor-pointer w-full relative z-10 border border-gray-100">

        {/* Image Section */}
        <div className="relative w-full md:w-5/12 h-72 md:h-auto shrink-0 overflow-hidden bg-gradient-to-br from-[#f6e5c4]/30 to-[#f79d1c]/10 z-10 flex items-center justify-center p-8">
          <img src={course.thumbnailUrl} alt={course.category} className="w-full h-full object-contain mix-blend-multiply opacity-80" />
          
          {course.tags && course.tags.length > 0 && (
            <div className="absolute top-6 left-6 flex gap-2 z-20">
              {course.tags.map(tag => (
                <span key={tag} className="px-5 py-2 text-sm uppercase tracking-wider rounded-full bg-[#32a569] text-white shadow-md font-normal" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Fade Out Edge to right (desktop) and bottom (mobile) */}
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-white z-10 hidden md:block"></div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white z-10 md:hidden"></div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 p-8 md:p-12 justify-center bg-transparent z-20 relative drop-shadow-sm overflow-hidden">
        
          {/* Absolute randomized decors floating STRICTLY in content area */}
          {decors.map((d, idx) => (
            <img 
              key={idx} 
              src={d.src} 
              alt="decor" 
              className="absolute opacity-10 pointer-events-none z-0 mix-blend-multiply" 
              style={{ top: `${d.top}%`, left: `${d.left}%`, width: `${d.size}px`, transform: `rotate(${d.rotation}deg)` }} 
            />
          ))}

          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="px-4 py-1.5 bg-[#ea7c9d]/10 text-[#ea7c9d] rounded-2xl text-xs uppercase tracking-widest border border-[#ea7c9d]/20 font-normal" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
              {course.category} • {course.ageRange} yrs
            </span>
          </div>
          
          <h3 className="text-3xl md:text-5xl text-gray-800 mb-6 leading-[1.2] group-hover:text-[#ea7c9d] transition-colors font-normal" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
            {course.title}
          </h3>
          
          <p className="text-xl text-gray-500 uppercase tracking-widest font-normal" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
            {course.author}
          </p>
        </div>
      </div>
    </>
  );
};
