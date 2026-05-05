"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ICourseDetail, ICourseContent } from "../interfaces/course.types";

interface CourseLearningPathProps {
  course: ICourseDetail;
}

export function CourseLearningPath({ course }: CourseLearningPathProps) {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col pb-32">
      {course.contents.map((content, i) => {
        // Mock watched status: first two are watched
        const isWatched = i < 2;
        const isNextWatched = i + 1 < 2; // For the connecting line
        const isEven = i % 2 === 0;
        const isLast = i === course.contents.length - 1;

        return (
          <div key={content.id} className="relative w-full h-56 flex items-center justify-center">
            {/* The Connecting Line (Curve) */}
            {!isLast && (
              <div
                className={`absolute top-1/2 w-1/2 h-full border-dashed border-4 z-0 ${
                  isNextWatched ? "border-[#32a569]" : "border-[#f6e5c4]"
                } ${
                  isEven
                    ? "right-0 border-l-0 rounded-r-[120px]"
                    : "left-0 border-r-0 rounded-l-[120px]"
                }`}
              />
            )}

            {/* The Content Node */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-full flex items-center z-10 ${
                isEven ? "flex-row" : "flex-row-reverse"
              }`}
            >
              {/* Empty space for the other side */}
              <div className="w-1/2" />

              {/* Center Circle Marker */}
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
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

              {/* Label (Thumbnail + Title) */}
              <div
                className={`w-1/2 flex ${
                  isEven ? "justify-start pl-16 sm:pl-24" : "justify-end pr-16 sm:pr-24"
                }`}
              >
                <Link
                  href={`/courses/${course.id}/learn/${content.id}`}
                  className={`group relative flex flex-col items-center bg-white p-3 rounded-2xl shadow-md border-2 hover:shadow-xl transition-all hover:-translate-y-1 w-48 sm:w-64 ${
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
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
