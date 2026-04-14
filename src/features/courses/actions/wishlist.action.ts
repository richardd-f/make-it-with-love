"use server";

export async function toggleWishlist(courseId: string): Promise<{ success: boolean; message: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  console.log(`Course ${courseId} was toggled in wishlist`);
  
  return {
    success: true,
    message: "Course wishlist toggled",
  };
}
