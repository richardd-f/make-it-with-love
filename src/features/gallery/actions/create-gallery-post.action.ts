"use server";

import { auth } from "@/src/auth";
import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createGalleryPost(
  courseId: string,
  title: string,
  caption: string,
  mediaUrl: string,
  mediaType: "image" | "video",
  rating?: number
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id, courseId }
  });

  if (!enrollment) {
    return { success: false, error: "Not enrolled in this course" };
  }

  const validRating = rating && rating >= 1 && rating <= 5 ? rating : null;

  await prisma.imageGallery.create({
    data: {
      title,
      caption: caption || null,
      url: mediaUrl,
      mediaType,
      rating: validRating,
      enrollmentId: enrollment.id
    }
  });

  revalidatePath(`/courses/${courseId}/gallery`);

  return { success: true };
}
