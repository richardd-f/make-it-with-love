"use server";

import prisma from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import { ICourseDetail } from "../interfaces/course.types";

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

export async function getCourseDetail(id: string): Promise<ICourseDetail | null> {
  const session = await auth();
  const userId = session?.user?.id;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      courseCategories: {
        include: { category: true },
      },
      videos: {
        orderBy: { id: "asc" },
      },
      courseKits: {
        include: { diyKit: true },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });

  if (!course) return null;

  // Check enrollment and subscription independently
  let isOwned = false;       // enrolled in this specific course
  let isSubscribed = false;  // has an active platform subscription
  if (userId) {
    const [enrollment, activeSubscription] = await Promise.all([
      prisma.enrollment.findFirst({ where: { userId, courseId: id } }),
      prisma.userSubscription.findFirst({ where: { userId, status: "active" } }),
    ]);
    isOwned = !!enrollment;
    isSubscribed = !!activeSubscription;
  }

  // Get category
  const category =
    course.courseCategories[0]?.category.category || "General";

  // Map starter kit from courseKits → diyKits
  const kits = course.courseKits.map((ck) => ck.diyKit);
  const starterKit = {
    tools: kits.length > 0 ? kits.map((k) => k.name) : ["DIY Kit (included)"],
    weight: "500g",
    estimatedDelivery: "2-3 Business Days",
    inStock: kits.length > 0 ? kits.every((k) => k.stock > 0) : true,
  };

  // Map videos to course contents
  const hasAccess = isOwned || isSubscribed;

  const contents = course.videos.map((video, i) => ({
    id: video.id,
    title: video.title,
    duration: "10:00",
    isLocked: !hasAccess && i > 0, // First video is always a preview
    videoUrl: video.url,
  }));

  return {
    id: course.id,
    title: course.name,
    author: "MakeitWithLove",
    rating: 0,
    totalReviews: 0,
    price: course.price,
    category,
    ageRange: `${course.minAge}+`,
    thumbnailUrl: getThumbnail(course.id),
    tags: [],
    description: course.description || "",
    videoPreviewUrl: course.videos[0]?.url || "",
    totalStudents: course._count.enrollments,
    isOwned,
    isSubscribed,
    starterKit,
    contents,
    reviews: [],
  };
}
