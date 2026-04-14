"use server";

import { ICourseDetail, IReview } from "../interfaces/course.types";

const MOCK_REVIEWS: IReview[] = [
  {
    id: "r1",
    userName: "Little Timmy",
    rating: 5,
    text: "I loved making this! The video was so easy to follow and the clay is super soft.",
    resultImageUrl: "/images/assets/star1_pink.webp", // Fun mock image fallback
    createdAt: "1 week ago"
  },
  {
    id: "r2",
    userName: "Sarah & Mom",
    rating: 4,
    text: "Great weekend activity. The colors were a bit messy but that's half the fun!",
    createdAt: "2 weeks ago"
  }
];

export async function getCourseDetail(id: string): Promise<ICourseDetail | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Determine mock ownership/stock states based on ID for different UI tests
  const isOwned = parseInt(id) % 3 === 0; // Every 3rd course is "Owned"
  const inStock = parseInt(id) % 4 !== 0; // Every 4th course is "Out of Stock"

  return {
    id,
    title: `Creative Course ${id} - Masterclass Edition`,
    author: "Jane Doe",
    rating: 4.8,
    totalReviews: 124,
    price: 150000,
    category: "Clay",
    ageRange: "6-8",
    thumbnailUrl: "/images/assets/coral1_pink.webp",
    tags: ["Bestseller", "New"],
    description: "Welcome to the ultimate creative adventure! In this course, we will explore the magical world of handmade crafts. Get ready to squish, shape, and paint your very own masterpiece from scratch. No prior experience is needed, just bring your imagination and get ready to have a blast!",
    videoPreviewUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // simple open source video
    totalStudents: 342,
    isOwned,
    starterKit: {
      tools: ["10x Colored Clay blocks", "2x Sculpting Tools", "1x Magic Glaze", "Instruction Booklet"],
      weight: "500g",
      estimatedDelivery: "2-3 Business Days",
      inStock
    },
    contents: [
      { id: "c1", title: "Welcome & Unboxing", duration: "05:20", isLocked: false },
      { id: "c2", title: "Basic Shapes & Techniques", duration: "12:45", isLocked: !isOwned },
      { id: "c3", title: "Building the Core", duration: "18:10", isLocked: !isOwned },
      { id: "c4", title: "Adding Detail & Personality", duration: "15:30", isLocked: !isOwned },
      { id: "c5", title: "Painting & Glazing finish", duration: "09:00", isLocked: !isOwned },
    ],
    reviews: MOCK_REVIEWS
  };
}
