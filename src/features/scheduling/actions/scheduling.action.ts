"use server";

import prisma from "@/src/lib/prisma";
import { ITimeSlot } from "../interfaces/scheduling.types";
import { bookMeeting } from "@/src/features/courses/actions/book-meeting.action";

export async function getCourseAvailableSlots(courseId: string): Promise<ITimeSlot[]> {
  const now = new Date();

  const schedules = await prisma.teacherSchedule.findMany({
    where: {
      courseId,
      status: "AVAILABLE",
      startTime: { gte: now },
    },
    include: {
      teacher: { select: { userId: true, name: true, photo: true } },
    },
    orderBy: { startTime: "asc" },
  });

  return schedules.map((s) => ({
    id: s.id,
    teacher: { id: s.teacher.userId, name: s.teacher.name, photo: s.teacher.photo },
    startTime: s.startTime,
    endTime: s.endTime,
    status: s.status as "AVAILABLE" | "BOOKED",
  }));
}

export async function bookAppointment(
  scheduleId: string,
  courseId: string
): Promise<{ success: boolean; message: string }> {
  return bookMeeting(scheduleId, courseId);
}
