"use server";

import prisma from "@/src/lib/prisma";
import { auth } from "@/src/auth";

/**
 * Auto-enroll an active subscriber into a course they are accessing.
 * Called when a subscriber opens course content so they gain a real
 * enrollment (meeting quota + gallery), not just unlocked videos.
 * No-op if the user is not subscribed or is already enrolled.
 */
export async function ensureSubscriberEnrollment(courseId: string): Promise<void> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return;

  const existing = await prisma.enrollment.findFirst({
    where: { userId, courseId },
  });
  if (existing) return;

  const activeSubscription = await prisma.userSubscription.findFirst({
    where: { userId, status: "active", endDate: { gt: new Date() } },
    include: { subscription: true },
  });
  if (!activeSubscription) return;

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return;

  try {
    await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        meetingsAmountLeft:
          course.amountOfMeeting + activeSubscription.subscription.meetingAdditions,
      },
    });
  } catch {
    // Unique constraint (userId, courseId) — already enrolled via a race. Safe to ignore.
  }
}
