"use server";

import prisma from "@/src/lib/prisma";
import { auth } from "@/src/auth";

export type TrackingEventType = 
  | "REGISTER_VIEW" 
  | "REGISTER_SUBMIT"
  | "BUY_COURSE_CLICK"
  | "BUY_SUBSCRIPTION_CLICK"
  | "BUY_DIY_KIT_CLICK"
  | "GALLERY_ZOOM_CLICK"
  | "GALLERY_ADD_IMAGE_CLICK"
  | "BOOK_ZOOM_MEETING_CLICK";

export async function trackEvent(action: TrackingEventType, details?: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id || null;

    await prisma.userAction.create({
      data: {
        action,
        details,
        userId,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to track event:", error);
    return { success: false, error };
  }
}
