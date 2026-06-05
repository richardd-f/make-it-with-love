"use server";

import { auth } from "@/src/auth";
import prisma from "@/src/lib/prisma";

export type SubscriptionStatus = "active" | "pending" | "none";

export async function getSubscriptionStatus(): Promise<{ status: SubscriptionStatus }> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { status: "none" };
    }

    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId,
        OR: [
          { status: "pending" },
          { status: "active", endDate: { gt: new Date() } },
        ],
      },
      orderBy: { startDate: "desc" },
    });

    if (!subscription) {
      return { status: "none" };
    }

    return { status: subscription.status as SubscriptionStatus };
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return { status: "none" };
  }
}
