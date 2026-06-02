"use client";

import Image from "next/image";
import Link from "next/link";
import { IEnrolledCourse } from "../interfaces/course.types";

interface EnrolledCourseCardProps {
  course: IEnrolledCourse;
}

export function EnrolledCourseCard({ course }: EnrolledCourseCardProps) {
  const progress = course.totalVideos > 0
    ? Math.round((course.watchedVideos / course.totalVideos) * 100)
    : 0;

  const isComplete = progress === 100;

  return (
    <Link
      href={`/courses/${course.id}/learn`}
      className="enrolled-card group flex flex-col bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer w-[320px] sm:w-[380px] lg:w-[440px] shrink-0 border border-gray-100/60 hover:scale-[1.02] select-none"
      draggable={false}
      style={{ willChange: "transform" }}
    >
      {/* 1. Course Image — clipped inside its own rounded container */}
      <div className="relative w-full h-52 rounded-t-3xl overflow-hidden bg-gradient-to-br from-[#f6e5c4]/40 to-[#f79d1c]/10 flex items-center justify-center p-6 shrink-0">
        <Image
          src={course.thumbnailUrl}
          alt={course.title}
          width={360}
          height={360}
          className="w-full h-full object-contain mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-500"
          draggable={false}
        />
        {course.tags && course.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-1.5 z-10">
            {course.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-[10px] uppercase tracking-wider rounded-full bg-[#32a569] text-white shadow-md font-medium"
                style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-white pointer-events-none" />
      </div>

      {/* 2. Title */}
      <div className="px-6 pt-4">
        <h3 className="font-family-papernotes text-2xl text-gray-800 leading-tight line-clamp-2 group-hover:text-[#32a569] transition-colors duration-300">
          {course.title}
        </h3>
      </div>

      {/* 3. Description */}
      <div className="px-6 pt-2">
        <p
          className="text-sm text-gray-500 leading-relaxed line-clamp-2"
          style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
        >
          {course.description}
        </p>
      </div>

      {/* 4. Progress Bar */}
      <div className="px-6 pt-5 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span
            className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold"
            style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
          >
            Progress
          </span>
          <span
            className="text-sm font-bold"
            style={{
              fontFamily: "var(--font-montserrat, Montserrat, sans-serif)",
              color: isComplete ? "#32a569" : "#f79d1c",
            }}
          >
            {progress}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progress}%`,
              background: isComplete
                ? "linear-gradient(90deg, #32a569, #2dd4bf)"
                : "linear-gradient(90deg, #f79d1c, #fbbf24)",
            }}
          />
        </div>
      </div>

      {/* 5. Select Button */}
      <div className="px-6 pt-5 pb-6 mt-auto">
        <span
          className="block w-full text-center py-3.5 rounded-2xl text-white font-bold text-sm tracking-wide transition-all duration-300 group-hover:shadow-lg"
          style={{
            fontFamily: "var(--font-montserrat, Montserrat, sans-serif)",
            background: isComplete
              ? "linear-gradient(135deg, #32a569, #2dd4bf)"
              : "linear-gradient(135deg, #32a569, #22c55e)",
          }}
        >
          {isComplete ? "✓ Completed" : "Select"}
        </span>
      </div>
    </Link>
  );
}
