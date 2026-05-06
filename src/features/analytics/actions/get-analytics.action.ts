"use server";

import { prisma } from "@/src/lib/prisma";

export type EventSummary = {
  action: string;
  count: number;
  latest: Date | null;
};

export async function getEventSummaries(): Promise<EventSummary[]> {
  const EVENT_TYPES = [
    "REGISTER_VIEW",
    "REGISTER_SUBMIT",
    "BUY_COURSE_CLICK",
    "BUY_SUBSCRIPTION_CLICK",
    "BUY_DIY_KIT_CLICK",
    "GALLERY_ZOOM_CLICK",
    "GALLERY_ADD_IMAGE_CLICK",
    "BOOK_ZOOM_MEETING_CLICK",
    "TRY_AR_FEATURE_CLICK",
  ];

  const results = await Promise.all(
    EVENT_TYPES.map(async (action) => {
      const [count, latest] = await Promise.all([
        prisma.userAction.count({ where: { action } }),
        prisma.userAction.findFirst({
          where: { action },
          orderBy: { createdAt: "desc" },
          select: { createdAt: true },
        }),
      ]);
      return { action, count, latest: latest?.createdAt ?? null };
    })
  );

  return results;
}

export async function getRecentEvents(limit = 50) {
  return prisma.userAction.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });
}

export async function getTotalUsers() {
  return prisma.user.count();
}

export async function getBookingInterestByCourse() {
  const bookings = await prisma.userAction.findMany({
    where: { action: "BOOK_ZOOM_MEETING_CLICK" },
    select: { details: true },
  });

  const counts: Record<string, number> = {};
  for (const b of bookings) {
    const courseId = b.details?.replace("courseId:", "") ?? "unknown";
    counts[courseId] = (counts[courseId] ?? 0) + 1;
  }

  // Enrich with course names
  const courseIds = Object.keys(counts).filter((id) => id !== "unknown");
  const courses = await prisma.course.findMany({
    where: { id: { in: courseIds } },
    select: { id: true, name: true },
  });

  const courseMap = Object.fromEntries(courses.map((c) => [c.id, c.name]));

  return Object.entries(counts).map(([courseId, count]) => ({
    courseId,
    courseName: courseMap[courseId] ?? courseId,
    count,
  }));
}
