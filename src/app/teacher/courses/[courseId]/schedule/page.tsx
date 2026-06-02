import React from "react";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import prisma from "@/src/lib/prisma";
import { getTeacherSchedulesForCourse } from "@/src/features/teacher/actions/create-teacher-schedule.action";
import { TeacherScheduleBoard } from "@/src/features/teacher/components/TeacherScheduleBoard";
import { BreadcrumbList } from "@/src/components/ui/breadcrumbs";

export default async function TeacherCoursesSchedulePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "TEACHER") redirect("/");

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) redirect("/teacher/courses");

  // Verify teacher is accepted for this course
  const enrollment = await prisma.teacherEnrollment.findFirst({
    where: { teacherId: session.user.id, courseId, status: "ACCEPTED" },
  });
  if (!enrollment) redirect("/teacher/courses");

  const schedules = await getTeacherSchedulesForCourse(courseId);

  const serialized = schedules.map((s) => ({
    ...s,
    startTime: s.startTime,
    endTime: s.endTime,
    createdAt: s.createdAt,
  }));

  return (
    <main className="min-h-screen relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="mb-8 animate-fade-in">
        <BreadcrumbList
          items={[
            { label: "Teacher", href: "/teacher" },
            { label: "My Courses", href: "/teacher/courses" },
            { label: course.name, active: true },
          ]}
        />
      </div>

      <div className="animate-fade-in delay-200">
      <TeacherScheduleBoard
        courseId={courseId}
        courseTitle={course.name}
        initialSchedules={serialized}
      />
      </div>
    </main>
  );
}
