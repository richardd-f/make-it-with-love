import React from "react";
import { getLikedCourses } from "@/src/features/courses/actions/get-liked-courses.action";
import { CourseCard } from "@/src/features/courses/components/course-card";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Liked Courses | Make It With Love",
};

export default async function LikedCoursesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const courses = await getLikedCourses();

  return (
    <main className="min-h-screen relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="mb-10 animate-fade-in">
        <h1 className="text-6xl font-family-papernotes text-gray-800 mb-2">Liked Courses</h1>
        <p className="text-gray-500 font-sans text-lg">Courses you&apos;ve hearted ❤️</p>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6 animate-fade-in delay-200">
          <div className="text-8xl">🤍</div>
          <h2 className="text-3xl font-family-papernotes text-gray-600">No liked courses yet</h2>
          <p className="text-gray-400 font-sans text-lg text-center max-w-md">
            Browse courses and tap the heart icon to save your favourites here.
          </p>
          <Link
            href="/courses"
            className="px-8 py-4 bg-[#32a569] text-white font-bold text-xl rounded-full hover:bg-[#28915a] transition-colors font-family-papernotes tracking-widest"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6 animate-fade-in delay-200">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </main>
  );
}
