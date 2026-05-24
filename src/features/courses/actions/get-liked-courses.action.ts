"use server";

import prisma from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import { ICourse } from "../interfaces/course.types";

const THUMBNAIL_IMAGES = [
  "circle_green.webp", "circle_orange.webp", "circle_pink.webp", "circle_red.webp", "circle_yellow.webp",
  "coral1_green.webp", "coral1_orange.webp", "coral1_pink.webp", "coral1_red.webp",
  "coral2_green.webp", "coral2_orange.webp", "coral2_pink.webp", "coral2_red.webp"
];

function getThumbnail(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `/images/assets/${THUMBNAIL_IMAGES[Math.abs(hash) % THUMBNAIL_IMAGES.length]}`;
}

export async function getLikedCourses(): Promise<ICourse[]> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return [];

  const wishlists = await prisma.wishlist.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          courseCategories: { include: { category: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return wishlists.map((w) => ({
    id: w.course.id,
    title: w.course.name,
    author: "MakeitWithLove",
    rating: 0,
    totalReviews: 0,
    price: w.course.price,
    category: w.course.courseCategories[0]?.category.category || "General",
    ageRange: `${w.course.minAge}+`,
    thumbnailUrl: getThumbnail(w.course.id),
    tags: [],
  }));
}
