"use server";

import prisma from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import { revalidatePath } from "next/cache";

export async function enrollToTeach(courseId: string): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || session.user?.role !== "TEACHER") {
    return { success: false, message: "Only teachers can enroll to teach." };
  }

  try {
    await prisma.teacherEnrollment.upsert({
      where: { teacherId_courseId: { teacherId: userId, courseId } },
      update: { status: "PENDING" },
      create: { teacherId: userId, courseId, status: "PENDING" },
    });

    revalidatePath("/teacher");
    return { success: true, message: "Enrollment request submitted! Waiting for admin approval." };
  } catch {
    return { success: false, message: "Failed to submit enrollment request." };
  }
}

export async function getTeacherEnrollmentStatus(courseId: string): Promise<"PENDING" | "ACCEPTED" | "REJECTED" | null> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const enrollment = await prisma.teacherEnrollment.findFirst({
    where: { teacherId: userId, courseId },
  });

  return enrollment?.status ?? null;
}

export async function withdrawTeachEnrollment(courseId: string): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || session.user?.role !== "TEACHER") {
    return { success: false, message: "Only teachers can withdraw from a course." };
  }

  try {
    const schedules = await prisma.teacherSchedule.findMany({
      where: { teacherId: userId, courseId },
      select: { id: true },
    });
    const scheduleIds = schedules.map((s) => s.id);

    if (scheduleIds.length > 0) {
      await prisma.meeting.deleteMany({ where: { teacherScheduleId: { in: scheduleIds } } });
      await prisma.teacherSchedule.deleteMany({ where: { id: { in: scheduleIds } } });
    }

    await prisma.teacherEnrollment.deleteMany({ where: { teacherId: userId, courseId } });

    revalidatePath("/teacher");
    return { success: true, message: "Enrollment withdrawn successfully." };
  } catch {
    return { success: false, message: "Failed to withdraw enrollment." };
  }
}
