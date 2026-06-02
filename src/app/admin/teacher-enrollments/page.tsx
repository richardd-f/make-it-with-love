import React from "react";
import { getAllTeacherEnrollments } from "@/src/features/admin/teacher-enrollments/actions/manage-teacher-enrollment.action";
import { TeacherEnrollmentActions } from "@/src/features/admin/teacher-enrollments/components/TeacherEnrollmentActions";

export const metadata = {
  title: "Teacher Enrollment Requests | Admin",
};

export default async function AdminTeacherEnrollmentsPage() {
  const enrollments = await getAllTeacherEnrollments();

  return (
    <main className="min-h-screen relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="mb-10 animate-fade-in">
        <h1 className="text-5xl font-family-papernotes text-gray-800 mb-2">Teacher Requests</h1>
        <p className="text-gray-500 font-sans">Review and manage teacher enrollment requests.</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-24 text-gray-400 font-family-papernotes text-3xl">
          No requests yet.
        </div>
      ) : (
        <div className="flex flex-col gap-4 animate-fade-in delay-200">
          {enrollments.map((e) => (
            <div
              key={e.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-[2rem] p-6 shadow-lg border-2 border-gray-100"
            >
              <div className="flex items-center gap-4">
                {e.teacher.photo ? (
                  <img
                    src={e.teacher.photo}
                    alt={e.teacher.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#f79d1c]"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#f6e5c4] flex items-center justify-center text-2xl text-[#f79d1c] font-bold">
                    {e.teacher.name[0]}
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-gray-800 text-lg font-family-papernotes">{e.teacher.name}</span>
                  <span className="text-sm text-gray-500">{e.teacher.email}</span>
                  {e.teacher.expertise && (
                    <span className="text-xs text-[#f79d1c] font-bold uppercase tracking-widest">{e.teacher.expertise}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1 min-w-[200px]">
                <span className="text-sm font-bold text-gray-700">Course:</span>
                <span className="text-gray-600 font-family-papernotes text-lg">{e.course.name}</span>
                <span className="text-xs text-gray-400">
                  {new Date(e.createdAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                </span>
              </div>

              <TeacherEnrollmentActions enrollmentId={e.id} currentStatus={e.status} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
