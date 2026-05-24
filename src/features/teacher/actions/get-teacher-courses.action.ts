"use server";

import prisma from "@/src/lib/prisma";
import { auth } from "@/src/auth";

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

export async function getAllCoursesForTeacher() {
  const session = await auth();
  const userId = session?.user?.id;

  const courses = await prisma.course.findMany({
    include: {
      courseCategories: { include: { category: true } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  let enrollmentMap: Record<string, { status: string }> = {};
  if (userId) {
    const enrollments = await prisma.teacherEnrollment.findMany({
      where: { teacherId: userId },
    });
    enrollmentMap = Object.fromEntries(
      enrollments.map((e) => [e.courseId, { status: e.status }])
    );
  }

  return courses.map((c) => ({
    id: c.id,
    title: c.name,
    description: c.description || "",
    price: c.price,
    category: c.courseCategories[0]?.category.category || "General",
    ageRange: `${c.minAge}+`,
    thumbnailUrl: getThumbnail(c.id),
    totalStudents: c._count.enrollments,
    enrollmentStatus: enrollmentMap[c.id]?.status ?? null,
  }));
}

export async function getAcceptedTeacherCourses() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];

  const enrollments = await prisma.teacherEnrollment.findMany({
    where: { teacherId: userId, status: "ACCEPTED" },
    include: {
      course: {
        include: {
          courseCategories: { include: { category: true } },
          _count: { select: { enrollments: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return enrollments.map((e) => ({
    id: e.course.id,
    title: e.course.name,
    description: e.course.description || "",
    price: e.course.price,
    category: e.course.courseCategories[0]?.category.category || "General",
    ageRange: `${e.course.minAge}+`,
    thumbnailUrl: getThumbnail(e.course.id),
    totalStudents: e.course._count.enrollments,
    amountOfMeeting: e.course.amountOfMeeting,
  }));
}
