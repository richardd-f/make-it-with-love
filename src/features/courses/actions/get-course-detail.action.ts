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

  let isOwned = false;
  let isSubscribed = false;
  let meetingsAmountLeft: number | undefined;
  let subscriptionMeetingsLeft: number | undefined;
  let isWishlisted = false;

  let watchedVideoIds = new Set<string>();

  const ratingData = await prisma.imageGallery.aggregate({
    where: {
      enrollment: { courseId: id },
      rating: { not: null },
    },
    _avg: { rating: true },
    _count: { rating: true },
  });

  const avgRating = ratingData._avg.rating
    ? Math.round(ratingData._avg.rating * 10) / 10
    : 0;
  const totalReviewsCount = ratingData._count.rating;

  if (userId) {
    const [enrollment, activeSubscription, wishlist, watchedVideos] = await Promise.all([
      prisma.enrollment.findFirst({ where: { userId, courseId: id } }),
      prisma.userSubscription.findFirst({
        where: { userId, status: "active", endDate: { gt: new Date() } },
        include: { subscription: true },
      }),
      prisma.wishlist.findFirst({ where: { userId, courseId: id } }),
      prisma.userVideo.findMany({
        where: { userId, videoId: { in: course.videos.map((v) => v.id) }, isDone: true },
        select: { videoId: true },
      }),
    ]);

    watchedVideoIds = new Set(watchedVideos.map((uv) => uv.videoId));

    isOwned = !!enrollment;
    isSubscribed = !!activeSubscription;
    isWishlisted = !!wishlist;

    if (enrollment) {
      meetingsAmountLeft = enrollment.meetingsAmountLeft;
    }
    if (activeSubscription) {
      subscriptionMeetingsLeft = activeSubscription.meetingAdditionsLeft;
    }
  }

  const category =
    course.courseCategories[0]?.category.category || "General";

  const kits = course.courseKits.map((ck) => ck.diyKit);
  const starterKit = {
    tools: kits.length > 0 ? kits.map((k) => k.name) : ["DIY Kit (included)"],
    weight: "500g",
    estimatedDelivery: "2-3 Business Days",
    inStock: kits.length > 0 ? kits.every((k) => k.stock > 0) : true,
  };

  const hasAccess = isOwned || isSubscribed;

  const contents = course.videos.map((video, i) => ({
    id: video.id,
    title: video.title,
    description: video.description || "",
    duration: "10:00",
    isLocked: !hasAccess && i > 0,
    videoUrl: video.url,
    isDone: watchedVideoIds.has(video.id),
  }));

  return {
    id: course.id,
    title: course.name,
    author: "MakeitWithLove",
    rating: avgRating,
    totalReviews: totalReviewsCount,
    price: course.price,
    category,
    ageRange: `${course.minAge}+`,
    thumbnailUrl: course.imgUrl || getThumbnail(course.id),
    tags: [],
    description: course.description || "",
    videoPreviewUrl: course.videos[0]?.url || "",
    totalStudents: course._count.enrollments,
    isOwned,
    isSubscribed,
    meetingsAmountLeft,
    subscriptionMeetingsLeft,
    amountOfMeeting: course.amountOfMeeting,
    isWishlisted,
    starterKit,
    contents,
    reviews: [],
  };
}
