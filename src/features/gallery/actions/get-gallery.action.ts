"use server";

import { IGalleryPost } from "../interfaces/gallery.types";
import prisma from "@/src/lib/prisma";

export async function getGalleryPosts(courseId: string): Promise<IGalleryPost[]> {
  const records = await prisma.imageGallery.findMany({
    where: {
      enrollment: { courseId }
    },
    include: {
      enrollment: {
        include: { user: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return records.map((record) => ({
    id: record.id,
    title: record.title ?? "My Craft",
    description: record.caption ?? "",
    mediaUrl: record.url,
    mediaType: (record.mediaType === "video" ? "video" : "image") as "image" | "video",
    authorName: record.enrollment.user.name,
    authorProfilePic: record.enrollment.user.photo ?? "/images/assets/circle_pink.webp",
    courseId,
    createdAt: record.createdAt,
  }));
}
