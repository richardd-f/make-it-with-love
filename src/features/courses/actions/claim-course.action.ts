"use server";

import prisma from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import { revalidatePath } from "next/cache";

export async function claimCourse(courseId: string): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, message: "You must be logged in to claim a course." };
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    return { success: false, message: "Course not found." };
  }

  if (course.price > 90000) {
    return { success: false, message: "This course is not eligible for free claim." };
  }

  const activeSubscription = await prisma.userSubscription.findFirst({
    where: { userId, status: "active" },
    include: { subscription: true },
  });

  if (!activeSubscription) {
    return { success: false, message: "You need an active subscription to claim courses." };
  }

  if (activeSubscription.coursesClaimedLeft <= 0) {
    return { success: false, message: "You have used all your free course claims for this subscription." };
  }

  const existingEnrollment = await prisma.enrollment.findFirst({
    where: { userId, courseId },
  });

  if (existingEnrollment) {
    return { success: false, message: "You already have access to this course." };
  }

  await prisma.$transaction([
    prisma.enrollment.create({
      data: {
        userId,
        courseId,
        meetingsAmountLeft:
          course.amountOfMeeting + activeSubscription.subscription.meetingAdditions,
      },
    }),
    prisma.userSubscription.update({
      where: { id: activeSubscription.id },
      data: { coursesClaimedLeft: activeSubscription.coursesClaimedLeft - 1 },
    }),
  ]);

  revalidatePath(`/courses/${courseId}`);
  return { success: true, message: "Course claimed successfully! You now have full access." };
}
