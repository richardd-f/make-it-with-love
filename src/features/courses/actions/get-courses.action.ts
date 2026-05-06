"use server";

import { ICourse, ICourseFilters, IPaginatedResponse } from "../interfaces/course.types";
import prisma from "@/src/lib/prisma";

const DECOR_IMAGES = [
  "circle_green.webp", "circle_orange.webp", "circle_pink.webp", "circle_red.webp", "circle_yellow.webp",
  "coral1_green.webp", "coral1_orange.webp", "coral1_pink.webp", "coral1_red.webp",
  "coral2_green.webp", "coral2_orange.webp", "coral2_pink.webp", "coral2_red.webp"
];

export async function getCourses(
  filters: Partial<ICourseFilters>,
  sort: string = "popular",
  page: number = 1,
  limit: number = 20
): Promise<IPaginatedResponse<ICourse>> {

  const whereClause: any = {};

  if (filters.query) {
    whereClause.name = {
      contains: filters.query,
      mode: 'insensitive'
    };
  }

  if (filters.categories && filters.categories.length > 0) {
    whereClause.courseCategories = {
      some: {
        category: {
          category: {
            in: filters.categories
          }
        }
      }
    };
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    whereClause.price = {};
    if (filters.minPrice !== undefined) whereClause.price.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) whereClause.price.lte = filters.maxPrice;
  }

  // Age ranges filter (approximate logic since minAge is a number in DB)
  if (filters.ageRanges && filters.ageRanges.length > 0) {
    // E.g. "6-8" -> minAge >= 6
    // Simple implementation: map range start to minAge
    const minAges = filters.ageRanges.map(r => parseInt(r.split('-')[0]));
    whereClause.minAge = {
      in: minAges
    };
  }

  let orderBy: any = {};
  switch (sort) {
    case "newest":
      orderBy = { createdAt: 'desc' };
      break;
    case "price_asc":
      orderBy = { price: 'asc' };
      break;
    case "price_desc":
      orderBy = { price: 'desc' };
      break;
    case "popular":
    default:
      // Since no reviews/popularity exists yet, fallback to newest or name
      orderBy = { createdAt: 'desc' };
      break;
  }

  const offset = (page - 1) * limit;

  const [coursesData, total] = await Promise.all([
    prisma.course.findMany({
      where: whereClause,
      orderBy,
      skip: offset,
      take: limit,
      include: {
        courseCategories: {
          include: {
            category: true
          }
        }
      }
    }),
    prisma.course.count({ where: whereClause })
  ]);

  const totalPages = Math.ceil(total / limit);

  const mappedData: ICourse[] = coursesData.map((course, index) => {
    // Pick a deterministic decor image based on course id length or index
    const decorIndex = course.id.charCodeAt(0) % DECOR_IMAGES.length;
    
    // Map categories to a string
    const categoryName = course.courseCategories[0]?.category.category || "General";

    return {
      id: course.id,
      title: course.name,
      author: "MIWL Instructor", // Default placeholder
      rating: 5.0, // Default placeholder
      totalReviews: 0, // Default placeholder
      price: course.price,
      category: categoryName,
      ageRange: `${course.minAge}+`,
      thumbnailUrl: `/images/assets/${DECOR_IMAGES[decorIndex]}`,
      tags: [],
    };
  });

  return {
    data: mappedData,
    total,
    page,
    totalPages
  };
}
