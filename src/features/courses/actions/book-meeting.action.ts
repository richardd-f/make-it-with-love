"use server";

import prisma from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import { revalidatePath } from "next/cache";

export async function bookMeeting(
  teacherScheduleId: string,
  courseId: string
): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, message: "You must be logged in to book a meeting." };
  }

  const schedule = await prisma.teacherSchedule.findUnique({
    where: { id: teacherScheduleId },
  });

  if (!schedule || schedule.status !== "AVAILABLE") {
    return { success: false, message: "This slot is no longer available." };
  }

  if (schedule.courseId !== courseId) {
    return { success: false, message: "Invalid schedule for this course." };
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId, courseId },
  });

  if (!enrollment) {
    return { success: false, message: "You must be enrolled in this course to book a meeting." };
  }

  // Check meeting quota: course meetings first, then subscription
  const activeSubscription = await prisma.userSubscription.findFirst({
    where: { userId, status: "active" },
  });

  const hasCourseQuota = enrollment.meetingsAmountLeft > 0;
  const hasSubQuota = activeSubscription && activeSubscription.meetingAdditionsLeft > 0;

  if (!hasCourseQuota && !hasSubQuota) {
    return { success: false, message: "You have no meeting quota left." };
  }

  await prisma.$transaction(async (tx) => {
    await tx.meeting.create({
      data: {
        enrollmentId: enrollment.id,
        teacherScheduleId,
      },
    });

    await tx.teacherSchedule.update({
      where: { id: teacherScheduleId },
      data: { status: "BOOKED" },
    });

    if (hasCourseQuota) {
      await tx.enrollment.update({
        where: { id: enrollment.id },
        data: { meetingsAmountLeft: enrollment.meetingsAmountLeft - 1 },
      });
    } else if (activeSubscription) {
      await tx.userSubscription.update({
        where: { id: activeSubscription.id },
        data: { meetingAdditionsLeft: activeSubscription.meetingAdditionsLeft - 1 },
      });
    }
  });

  revalidatePath(`/courses/${courseId}/schedule`);
  revalidatePath("/my-meetings");
  return { success: true, message: "Meeting booked! See you there 🎉" };
}

export async function getAvailableSlotsForCourse(courseId: string, dateStr: string) {
  const date = new Date(dateStr);
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const schedules = await prisma.teacherSchedule.findMany({
    where: {
      courseId,
      status: "AVAILABLE",
      startTime: { gte: dayStart, lte: dayEnd },
    },
    include: {
      teacher: { select: { userId: true, name: true, photo: true } },
    },
    orderBy: { startTime: "asc" },
  });

  return schedules.map((s) => ({
    id: s.id,
    teacher: {
      id: s.teacher.userId,
      name: s.teacher.name,
      photo: s.teacher.photo,
    },
    startTime: s.startTime,
    endTime: s.endTime,
    status: s.status,
  }));
}
