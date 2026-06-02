"use server";

import prisma from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import { IEnrolledCourse } from "../interfaces/course.types";

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

export async function getEnrolledCourses(): Promise<IEnrolledCourse[]> {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  const userId = session.user.id;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          courseCategories: {
            include: { category: true },
          },
          videos: {
            select: { id: true },
          },
          enrollments: {
            select: {
              imageGalleries: {
                where: { rating: { not: null } },
                select: { rating: true },
              },
            },
          },
        },
      },
    },
  });

  // Get all watched video IDs for this user in a single query
  const watchedUserVideos = await prisma.userVideo.findMany({
    where: { userId, isDone: true },
    select: { videoId: true },
  });
  const watchedVideoIds = new Set(watchedUserVideos.map((uv) => uv.videoId));

  return enrollments.map((enrollment) => {
    const course = enrollment.course;
    const category =
      course.courseCategories[0]?.category.category || "General";
    const videoIds = course.videos.map((v) => v.id);
    const watchedCount = videoIds.filter((id) => watchedVideoIds.has(id)).length;

    const allRatings = course.enrollments.flatMap((e) =>
      e.imageGalleries.map((g) => g.rating).filter((r): r is number => r !== null)
    );
    const avgRating = allRatings.length > 0
      ? Math.round((allRatings.reduce((a, b) => a + b, 0) / allRatings.length) * 10) / 10
      : 0;

    return {
      id: course.id,
      title: course.name,
      author: "MakeitWithLove",
      rating: avgRating,
      totalReviews: allRatings.length,
      price: course.price,
      category,
      ageRange: `${course.minAge}+`,
      thumbnailUrl: course.imgUrl || getThumbnail(course.id),
      tags: [],
      description: course.description || "",
      totalVideos: videoIds.length,
      watchedVideos: watchedCount,
    };
  });
}
