"use server";

import { IGalleryPost } from "../interfaces/gallery.types";

const FIRST_NAMES = ["Emma", "Liam", "Olivia", "Noah", "Ava", "William", "Sophia", "James", "Isabella", "Oliver"];
const DECOR_IMAGES = [
  "circle_green.webp", "circle_orange.webp", "circle_pink.webp", "circle_red.webp", "circle_yellow.webp",
  "coral1_green.webp", "coral1_orange.webp", "coral1_pink.webp", "coral1_red.webp"
];

// Helper to generate a deterministically random list of mock posts based on courseId
export async function getGalleryPosts(courseId: string): Promise<IGalleryPost[]> {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network

  // Use the courseId to seed the amount of posts to look realistic
  let hash = 0;
  for (let i = 0; i < courseId.length; i++) {
    hash = courseId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Create between 8 and 20 posts for this course
  const numPosts = 8 + (Math.abs(hash) % 13);
  
  const posts: IGalleryPost[] = [];
  
  for (let i = 0; i < numPosts; i++) {
    const randomIdx = (Math.abs(hash) + i) % DECOR_IMAGES.length;
    const randomNameIdx = (Math.abs(hash) + i) % FIRST_NAMES.length;
    
    // We'll use the decor images as placeholder "craft" images for now, 
    // but in a real app this would be user uploaded photos.
    posts.push({
      id: `post-${courseId}-${i}`,
      title: `My Awesome Creation #${i + 1}`,
      description: `I had so much fun making this! It took me a few hours but I learned a lot. I really loved mixing the colors together to make it look special!`,
      imageUrl: `/images/assets/${DECOR_IMAGES[randomIdx]}`,
      authorName: FIRST_NAMES[randomNameIdx],
      authorProfilePic: `/images/assets/${DECOR_IMAGES[(randomIdx + 3) % DECOR_IMAGES.length]}`, // Just using a decor image as a placeholder avatar
      courseId,
      createdAt: new Date(Date.now() - (Math.random() * 10000000000))
    });
  }

  return posts;
}
