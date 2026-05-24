"use server";

import prisma from "@/src/lib/prisma";
import { auth } from "@/src/auth";

export async function toggleWishlist(courseId: string): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, message: "You must be logged in to like courses." };
  }

  const existing = await prisma.wishlist.findFirst({
    where: { userId, courseId },
  });

  if (existing) {
    await prisma.wishlist.delete({ where: { wishlistId: existing.wishlistId } });
    return { success: true, message: "Removed from liked courses." };
  } else {
    await prisma.wishlist.create({
      data: { userId, courseId },
    });
    return { success: true, message: "Added to liked courses!" };
  }
}
