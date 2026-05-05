"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ICourseDetail, ICourseContent } from "../interfaces/course.types";

interface CourseLearningPathProps {
  course: ICourseDetail;
}

export function CourseLearningPath({ course }: CourseLearningPathProps) {
  // Helper component to render the card
  const CourseCard = ({ content, isWatched }: { content: ICourseContent; isWatched: boolean }) => (
    <Link
      href={`/courses/${course.id}/learn/${content.id}`}
      className={`group relative flex flex-col items-center bg-white p-3 rounded-2xl shadow-md border-2 hover:shadow-xl transition-all hover:-translate-y-1 w-full max-w-[260px] md:max-w-[280px] ${
        isWatched ? "border-[#32a569]/30" : "border-gray-100"
      }`}
    >
      <div className="w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-[#f6e5c4]/40 to-[#ea7c9d]/20 relative mb-3">
        <Image
          src={course.thumbnailUrl}
          alt={content.title}
          fill
          className="object-cover opacity-80 mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#32a569"
              stroke="#32a569"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-1"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      </div>
      <h3
        className={`font-bold text-center text-sm sm:text-base line-clamp-2 ${
          isWatched ? "text-[#32a569]" : "text-gray-700"
        }`}
        style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
      >
        {content.title}
      </h3>
      <p className="text-xs text-gray-400 mt-1 font-medium" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
        {content.duration}
      </p>
    </Link>
  );

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col pb-32 mt-4 px-2 sm:px-4">
      {course.contents.map((content, i) => {
        // Mock watched status: first two are watched
        const isWatched = i < 2;
        const isNextWatched = i + 1 < 2; // For the connecting line
        const isEven = i % 2 === 0;
        const isLast = i === course.contents.length - 1;

        return (
          <div key={content.id} className="relative w-full h-[320px] md:h-64">
            {/* The Connecting Line (Hand-drawn Wiggles) */}
            {!isLast && (
              <svg 
                className="absolute top-[28px] md:top-1/2 left-0 w-full h-full pointer-events-none z-0" 
                viewBox="0 0 100 100" 
                preserveAspectRatio="none"
              >
                {/* Mobile Path: Wiggles straight down */}
                <path 
                  className={`md:hidden ${isNextWatched ? "stroke-[#32a569]" : "stroke-[#cbd5e1]"}`}
                  d={isEven
                    ? "M 50 0 C 20 0, 20 100, 50 100" // Smooth mobile wiggle left
                    : "M 50 0 C 80 0, 80 100, 50 100"} // Smooth mobile wiggle right
                  strokeWidth="5" fill="none" vectorEffect="non-scaling-stroke" strokeLinecap="round"
                />
                {/* Desktop Path: Weaves opposite to the card */}
                <path 
                  className={`hidden md:block ${isNextWatched ? "stroke-[#32a569]" : "stroke-[#cbd5e1]"}`}
                  d={isEven 
                    ? "M 50 0 C 0 0, 0 100, 50 100" // Smooth desktop curve left
                    : "M 50 0 C 100 0, 100 100, 50 100"} // Smooth desktop curve right
                  strokeWidth="6" fill="none" vectorEffect="non-scaling-stroke" strokeLinecap="round"
                />
              </svg>
            )}

            {/* Center Circle Marker */}
            <div className="absolute top-0 md:top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-1/2 flex items-center justify-center z-20">
              <div
                className={`w-14 h-14 rounded-full border-4 flex items-center justify-center bg-white transition-transform hover:scale-110 shadow-lg ${
                  isWatched
                    ? "border-[#32a569] text-[#32a569]"
                    : "border-[#f79d1c] text-[#f79d1c]"
                }`}
              >
                {isWatched ? (
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className="font-bold text-xl" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>{i + 1}</span>
                )}
              </div>
            </div>

            {/* Mobile Card (below the circle) */}
            <div className="absolute top-[76px] left-1/2 -translate-x-1/2 w-[280px] md:hidden z-10 flex justify-center">
              <CourseCard content={content} isWatched={isWatched} />
            </div>

            {/* Desktop Card (left or right) */}
            <div 
              className={`hidden md:flex absolute top-1/2 -translate-y-1/2 ${
                isEven ? "left-1/2 pl-12 lg:pl-20" : "right-1/2 pr-12 lg:pr-20"
              } w-1/2 justify-${isEven ? "start" : "end"} z-10`}
            >
              <CourseCard content={content} isWatched={isWatched} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
