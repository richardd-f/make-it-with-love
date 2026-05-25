"use server";

import prisma from "@/src/lib/prisma";
import { ITimeSlotGroup, ITimeSlot } from "../interfaces/scheduling.types";
import { bookMeeting } from "@/src/features/courses/actions/book-meeting.action";

export async function getAvailableSlots(courseId: string, dateStr: string): Promise<ITimeSlotGroup[]> {
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

  // Group by time slot (start–end)
  const timeMap = new Map<string, ITimeSlot[]>();

  for (const s of schedules) {
    const timeLabel = `${s.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${s.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    if (!timeMap.has(timeLabel)) timeMap.set(timeLabel, []);
    timeMap.get(timeLabel)!.push({
      id: s.id,
      teacher: { id: s.teacher.userId, name: s.teacher.name, photo: s.teacher.photo },
      startTime: s.startTime,
      endTime: s.endTime,
      status: s.status as "AVAILABLE" | "BOOKED",
    });
  }

  return Array.from(timeMap.entries()).map(([timeLabel, slots]) => ({
    timeLabel,
    startTime: slots[0].startTime,
    slots,
  }));
}

export async function bookAppointment(
  scheduleId: string,
  courseId: string
): Promise<{ success: boolean; message: string }> {
  return bookMeeting(scheduleId, courseId);
}
