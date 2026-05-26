"use server";

import prisma from "@/src/lib/prisma";
import { auth } from "@/src/auth";

export async function addToCart(
  courseId: string
): Promise<{ success: boolean; message: string; alreadyInCart?: boolean }> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, message: "You must be logged in to add to cart." };
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    return { success: false, message: "Course not found." };
  }

  const existing = await prisma.cart.findFirst({
    where: { userId, courseId },
  });

  if (existing) {
    return { success: true, message: "Already in your cart.", alreadyInCart: true };
  }

  await prisma.cart.create({ data: { userId, courseId } });
  return { success: true, message: "Added to cart!" };
}
