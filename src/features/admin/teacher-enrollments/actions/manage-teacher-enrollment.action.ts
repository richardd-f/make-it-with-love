"use server";

import prisma from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import { revalidatePath } from "next/cache";

export async function getAllTeacherEnrollments() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return [];

  return prisma.teacherEnrollment.findMany({
    include: {
      teacher: { select: { userId: true, name: true, email: true, expertise: true, photo: true } },
      course: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateTeacherEnrollmentStatus(
  enrollmentId: string,
  status: "ACCEPTED" | "REJECTED"
): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, message: "Unauthorized." };
  }

  try {
    await prisma.teacherEnrollment.update({
      where: { id: enrollmentId },
      data: { status },
    });
    revalidatePath("/admin/teacher-enrollments");
    return { success: true, message: `Request ${status.toLowerCase()} successfully.` };
  } catch {
    return { success: false, message: "Failed to update status." };
  }
}

export async function unenrollTeacherFromCourse(
  enrollmentId: string
): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, message: "Unauthorized." };
  }

  try {
    const enrollment = await prisma.teacherEnrollment.findUnique({
      where: { id: enrollmentId },
      select: { teacherId: true, courseId: true },
    });

    if (!enrollment) {
      return { success: false, message: "Enrollment not found." };
    }

    const schedules = await prisma.teacherSchedule.findMany({
      where: { teacherId: enrollment.teacherId, courseId: enrollment.courseId },
      select: { id: true },
    });
    const scheduleIds = schedules.map((s) => s.id);

    if (scheduleIds.length > 0) {
      await prisma.meeting.deleteMany({ where: { teacherScheduleId: { in: scheduleIds } } });
      await prisma.teacherSchedule.deleteMany({ where: { id: { in: scheduleIds } } });
    }

    await prisma.teacherEnrollment.delete({ where: { id: enrollmentId } });

    revalidatePath("/admin/teacher-enrollments");
    return { success: true, message: "Teacher unenrolled from course." };
  } catch {
    return { success: false, message: "Failed to unenroll teacher." };
  }
}
