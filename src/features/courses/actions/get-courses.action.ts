"use server";

import { ICourse, ICourseFilters, IPaginatedResponse } from "../interfaces/course.types";

const CATEGORIES = ["Origami", "Painting", "Clay", "DIY Toys"];
const AGE_RANGES = ["6-8", "9-12"];

const DECOR_IMAGES = [
  "circle_green.webp", "circle_orange.webp", "circle_pink.webp", "circle_red.webp", "circle_yellow.webp",
  "coral1_green.webp", "coral1_orange.webp", "coral1_pink.webp", "coral1_red.webp",
  "coral2_green.webp", "coral2_orange.webp", "coral2_pink.webp", "coral2_red.webp"
];

// Generate 45 Mock Courses for pagination
const MOCK_COURSES: ICourse[] = Array.from({ length: 45 }).map((_, i) => ({
  id: `${i + 1}`,
  title: `Creative Course ${i + 1} - Fun Edition`,
  author: i % 2 === 0 ? "Jane Doe" : "John Smith",
  rating: 4.0 + (Math.random()),
  totalReviews: Math.floor(Math.random() * 200) + 10,
  price: 50000 + Math.floor(Math.random() * 5) * 50000, // 50k to 250k
  category: CATEGORIES[i % CATEGORIES.length],
  ageRange: AGE_RANGES[i % AGE_RANGES.length],
  thumbnailUrl: `/images/assets/${DECOR_IMAGES[i % DECOR_IMAGES.length]}`,
  tags: i % 7 === 0 ? ["Bestseller"] : i % 5 === 0 ? ["New"] : []
}));

export async function getCourses(
  filters: Partial<ICourseFilters>,
  sort: string = "popular",
  page: number = 1,
  limit: number = 20
): Promise<IPaginatedResponse<ICourse>> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  let filtered = [...MOCK_COURSES];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    filtered = filtered.filter(c => c.title.toLowerCase().includes(q) || c.author.toLowerCase().includes(q));
  }

  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(c => filters.categories!.includes(c.category));
  }

  if (filters.ageRanges && filters.ageRanges.length > 0) {
    filtered = filtered.filter(c => filters.ageRanges!.includes(c.ageRange));
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(c => c.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(c => c.price <= filters.maxPrice!);
  }

  if (filters.minRating !== undefined) {
    filtered = filtered.filter(c => c.rating >= filters.minRating!);
  }

  switch (sort) {
    case "newest":
      filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
      break;
    case "price_asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "popular":
    default:
      filtered.sort((a, b) => b.totalReviews - a.totalReviews);
      break;
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedData = filtered.slice(offset, offset + limit);

  return {
    data: paginatedData,
    total,
    page,
    totalPages
  };
}
