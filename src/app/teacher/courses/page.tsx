import React from "react";
import { getAcceptedTeacherCourses } from "@/src/features/teacher/actions/get-teacher-courses.action";
import Link from "next/link";

export const metadata = {
  title: "My Teaching Courses | Make It With Love",
};

export default async function TeacherCoursesPage() {
  const courses = await getAcceptedTeacherCourses();

  return (
    <main className="min-h-screen relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-6xl font-family-papernotes text-gray-800 mb-2">My Teaching Courses</h1>
        <p className="text-gray-500 font-sans text-lg">Courses you are approved to teach.</p>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center gap-6 py-24">
          <div className="text-7xl">📚</div>
          <h2 className="text-3xl font-family-papernotes text-gray-500">No accepted courses yet</h2>
          <p className="text-gray-400 text-center max-w-md font-sans">
            Enroll to teach from the course browser and wait for admin approval.
          </p>
          <Link
            href="/teacher"
            className="px-8 py-4 bg-[#f79d1c] text-white font-bold text-xl rounded-full hover:bg-[#e68f12] transition-colors font-family-papernotes tracking-widest"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/teacher/courses/${course.id}/schedule`}
              className="flex flex-col bg-white rounded-[2rem] p-6 shadow-lg border-2 border-gray-100 hover:border-[#f79d1c] hover:shadow-xl transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-16 h-16 rounded-2xl object-contain bg-[#fffbe6] mix-blend-multiply p-2 flex-shrink-0"
                />
                <div>
                  <span className="px-2 py-0.5 text-xs uppercase tracking-widest bg-[#ea7c9d]/10 text-[#ea7c9d] rounded-xl border border-[#ea7c9d]/20 font-bold">
                    {course.category}
                  </span>
                  <h2 className="font-family-papernotes text-2xl text-gray-800 group-hover:text-[#f79d1c] transition-colors mt-1">
                    {course.title}
                  </h2>
                </div>
              </div>
              <p className="text-sm text-gray-500 font-sans line-clamp-2 mb-4">{course.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-sm text-gray-400">{course.totalStudents} students</span>
                <span className="text-[#f79d1c] font-bold text-sm font-sans">Manage Schedule →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
