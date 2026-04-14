"use server";

import { ICourse, ICourseFilters, IPaginatedResponse } from "../interfaces/course.types";

// Mock data updated with IDR Currency
const MOCK_COURSES: ICourse[] = [
  { id: "1", title: "Origami Masterclass for Kids", author: "Jane Doe", rating: 4.8, totalReviews: 120, price: 150000, category: "Origami", ageRange: "6-8", thumbnailUrl: "/images/assets/placeholder.svg", tags: ["Bestseller"] },
  { id: "2", title: "Advanced Clay Modeling", author: "John Smith", rating: 4.5, totalReviews: 85, price: 250000, category: "Clay", ageRange: "9-12", thumbnailUrl: "/images/assets/placeholder.svg", tags: ["New"] },
  { id: "3", title: "DIY Toys from Recycled Materials", author: "Sarah Lee", rating: 4.9, totalReviews: 210, price: 100000, category: "DIY Toys", ageRange: "6-8", thumbnailUrl: "/images/assets/placeholder.svg" },
  { id: "4", title: "Painting Basics: Watercolor", author: "Michael Brown", rating: 4.2, totalReviews: 45, price: 200000, category: "Painting", ageRange: "9-12", thumbnailUrl: "/images/assets/placeholder.svg" },
  { id: "5", title: "Origami Animals", author: "Jane Doe", rating: 4.6, totalReviews: 150, price: 120000, category: "Origami", ageRange: "9-12", thumbnailUrl: "/images/assets/placeholder.svg" },
  { id: "6", title: "Monster Clay Creations", author: "John Smith", rating: 4.7, totalReviews: 95, price: 180000, category: "Clay", ageRange: "6-8", thumbnailUrl: "/images/assets/placeholder.svg", tags: ["Bestseller", "New"] },
  { id: "7", title: "DIY Wooden Cars", author: "Sarah Lee", rating: 4.4, totalReviews: 60, price: 160000, category: "DIY Toys", ageRange: "9-12", thumbnailUrl: "/images/assets/placeholder.svg" },
  { id: "8", title: "Acrylic Painting Fun", author: "Michael Brown", rating: 4.3, totalReviews: 30, price: 220000, category: "Painting", ageRange: "6-8", thumbnailUrl: "/images/assets/placeholder.svg", tags: ["New"] },
];

export async function getCourses(
  filters: Partial<ICourseFilters>,
  sort: string = "popular",
  page: number = 1,
  limit: number = 6
): Promise<IPaginatedResponse<ICourse>> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  let filtered = [...MOCK_COURSES];

  // Apply Search Query
  if (filters.query) {
    const q = filters.query.toLowerCase();
    filtered = filtered.filter(c => c.title.toLowerCase().includes(q) || c.author.toLowerCase().includes(q));
  }

  // Apply Categories
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(c => filters.categories!.includes(c.category));
  }

  // Apply Age Ranges
  if (filters.ageRanges && filters.ageRanges.length > 0) {
    filtered = filtered.filter(c => filters.ageRanges!.includes(c.ageRange));
  }

  // Apply Price
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(c => c.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(c => c.price <= filters.maxPrice!);
  }

  // Apply Rating
  if (filters.minRating !== undefined) {
    filtered = filtered.filter(c => c.rating >= filters.minRating!);
  }

  // Sorting
  switch (sort) {
    case "newest":
      filtered.sort((a, b) => b.id.localeCompare(a.id));
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

  // Pagination
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
