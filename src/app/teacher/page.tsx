import React from "react";
import { getAllCoursesForTeacher } from "@/src/features/teacher/actions/get-teacher-courses.action";
import { EnrollToTeachButton } from "@/src/features/teacher/components/EnrollToTeachButton";

export const metadata = {
  title: "Teacher — Browse Courses | Make It With Love",
};

export default async function TeacherHomePage() {
  const courses = await getAllCoursesForTeacher();

  return (
    <main className="min-h-screen relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-6xl font-family-papernotes text-gray-800 mb-2">All Courses</h1>
        <p className="text-gray-500 font-sans text-lg">
          Browse available courses and enroll to teach.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-[2rem] p-6 sm:p-8 shadow-lg border-2 border-gray-100"
          >
            <div className="flex items-center gap-6">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-20 h-20 rounded-2xl object-contain bg-[#fffbe6] mix-blend-multiply p-2 flex-shrink-0"
              />
              <div className="flex flex-col gap-1">
                <span className="px-3 py-1 bg-[#ea7c9d]/10 text-[#ea7c9d] rounded-xl text-xs uppercase tracking-widest border border-[#ea7c9d]/20 font-bold w-fit">
                  {course.category} • {course.ageRange} yrs
                </span>
                <h2 className="text-2xl font-family-papernotes text-gray-800">{course.title}</h2>
                <p className="text-sm text-gray-500 font-sans line-clamp-2">{course.description}</p>
                <span className="text-sm text-gray-400 font-sans">{course.totalStudents} students enrolled</span>
              </div>
            </div>

            <div className="flex-shrink-0">
              <EnrollToTeachButton
                courseId={course.id}
                initialStatus={course.enrollmentStatus as "PENDING" | "ACCEPTED" | "REJECTED" | null}
              />
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <div className="text-center py-24 text-gray-400 font-family-papernotes text-3xl">
            No courses available yet.
          </div>
        )}
      </div>
    </main>
  );
}
