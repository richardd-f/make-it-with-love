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

export async function updateTeacherSchedule(formData: FormData): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || session.user?.role !== "TEACHER") {
    return { success: false, message: "Only teachers can edit schedules." };
  }

  const scheduleId = formData.get("scheduleId") as string;
  const startTimeStr = formData.get("startTime") as string;
  const endTimeStr = formData.get("endTime") as string;
  const meetingUrl = formData.get("meetingUrl") as string;

  if (!scheduleId || !startTimeStr || !endTimeStr || !meetingUrl) {
    return { success: false, message: "All fields are required." };
  }

  const existing = await prisma.teacherSchedule.findUnique({
    where: { id: scheduleId },
    include: { _count: { select: { meetings: true } } },
  });
  if (!existing || existing.teacherId !== userId) {
    return { success: false, message: "Schedule not found." };
  }
  if (existing._count.meetings > 0) {
    return { success: false, message: "A student has already booked this slot and it cannot be edited." };
  }

  const startTime = new Date(startTimeStr);
  const endTime = new Date(endTimeStr);

  if (endTime <= startTime) {
    return { success: false, message: "End time must be after start time." };
  }

  // Check no time overlap for this teacher on the same day, excluding this slot
  const dayStart = new Date(startTime);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(startTime);
  dayEnd.setHours(23, 59, 59, 999);

  const overlapping = await prisma.teacherSchedule.findFirst({
    where: {
      teacherId: userId,
      id: { not: scheduleId },
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

  await prisma.teacherSchedule.update({
    where: { id: scheduleId },
    data: { startTime, endTime, meetingUrl },
  });

  revalidatePath(`/teacher/courses/${existing.courseId}/schedule`);
  return { success: true, message: "Schedule updated successfully!" };
}

export async function deleteTeacherSchedule(scheduleId: string): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || session.user?.role !== "TEACHER") {
    return { success: false, message: "Only teachers can delete schedules." };
  }

  const schedule = await prisma.teacherSchedule.findUnique({
    where: { id: scheduleId },
    include: { meetings: true },
  });

  if (!schedule || schedule.teacherId !== userId) {
    return { success: false, message: "Schedule not found." };
  }

  // Deleting a booked slot cancels the student's meeting; refund their quota.
  await prisma.$transaction(async (tx) => {
    for (const meeting of schedule.meetings) {
      await tx.enrollment.update({
        where: { id: meeting.enrollmentId },
        data: { meetingsAmountLeft: { increment: 1 } },
      });
    }
    await tx.meeting.deleteMany({ where: { teacherScheduleId: scheduleId } });
    await tx.teacherSchedule.delete({ where: { id: scheduleId } });
  });

  revalidatePath(`/teacher/courses/${schedule.courseId}/schedule`);
  revalidatePath("/my-meetings");
  return { success: true, message: "Schedule deleted." };
}

export async function getTeacherSchedulesForCourse(courseId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];

  return prisma.teacherSchedule.findMany({
    where: { teacherId: userId, courseId },
    include: { _count: { select: { meetings: true } } },
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
