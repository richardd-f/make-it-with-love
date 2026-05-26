"use server";

import prisma from "@/src/lib/prisma";
import { auth } from "@/src/auth";

export async function getMyMeetings() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];

  const meetings = await prisma.meeting.findMany({
    where: {
      enrollment: { userId },
    },
    include: {
      enrollment: {
        include: { course: true },
      },
      teacherSchedule: {
        include: {
          teacher: { select: { name: true, photo: true } },
        },
      },
    },
    orderBy: { bookedAt: "desc" },
  });

  const now = new Date();

  return meetings.map((m) => {
    const startTime = m.teacherSchedule.startTime;
    const fifteenMinBefore = new Date(startTime.getTime() - 15 * 60 * 1000);
    const showUrl = now >= fifteenMinBefore;

    return {
      id: m.id,
      courseTitle: m.enrollment.course.name,
      courseId: m.enrollment.courseId,
      teacherName: m.teacherSchedule.teacher.name,
      teacherPhoto: m.teacherSchedule.teacher.photo,
      startTime,
      endTime: m.teacherSchedule.endTime,
      meetingUrl: showUrl ? m.teacherSchedule.meetingUrl : null,
      bookedAt: m.bookedAt,
    };
  });
}
