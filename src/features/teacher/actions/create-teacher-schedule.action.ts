"use server";

import prisma from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import { revalidatePath } from "next/cache";

export async function createTeacherSchedule(formData: FormData): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || session.user?.role !== "TEACHER") {
    return { success: false, message: "Only teachers can create schedules." };
  }

  const courseId = formData.get("courseId") as string;
  const startTimeStr = formData.get("startTime") as string;
  const endTimeStr = formData.get("endTime") as string;
  const meetingUrl = formData.get("meetingUrl") as string;

  if (!courseId || !startTimeStr || !endTimeStr || !meetingUrl) {
    return { success: false, message: "All fields are required." };
  }

  const startTime = new Date(startTimeStr);
  const endTime = new Date(endTimeStr);

  if (endTime <= startTime) {
    return { success: false, message: "End time must be after start time." };
  }

  // Check no time overlap for this teacher across ALL courses on the same day
  const dayStart = new Date(startTime);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(startTime);
  dayEnd.setHours(23, 59, 59, 999);

  const overlapping = await prisma.teacherSchedule.findFirst({
    where: {
      teacherId: userId,
      startTime: { gte: dayStart, lte: dayEnd },
      OR: [
        { startTime: { gte: startTime, lt: endTime } },
        { endTime: { gt: startTime, lte: endTime } },
        { startTime: { lte: startTime }, endTime: { gte: endTime } },
      ],
    },
  });

  if (overlapping) {
    return { success: false, message: "You already have a schedule that overlaps with this time slot." };
  }

  // Verify teacher is accepted for this course
  const enrollment = await prisma.teacherEnrollment.findFirst({
    where: { teacherId: userId, courseId, status: "ACCEPTED" },
  });

  if (!enrollment) {
    return { success: false, message: "You are not accepted to teach this course." };
  }

  await prisma.teacherSchedule.create({
    data: { teacherId: userId, courseId, startTime, endTime, meetingUrl, status: "AVAILABLE" },
  });

  revalidatePath(`/teacher/courses/${courseId}/schedule`);
  return { success: true, message: "Schedule created successfully!" };
}

export async function getTeacherSchedulesForCourse(courseId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];

  return prisma.teacherSchedule.findMany({
    where: { teacherId: userId, courseId },
    orderBy: { startTime: "asc" },
  });
}

export async function getAllSchedulesForCourse(courseId: string) {
  return prisma.teacherSchedule.findMany({
    where: { courseId, status: "AVAILABLE" },
    include: {
      teacher: { select: { userId: true, name: true, photo: true } },
    },
    orderBy: { startTime: "asc" },
  });
}
