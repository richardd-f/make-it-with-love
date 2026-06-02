"use server";

import { auth } from "@/src/auth";
import prisma from "@/src/lib/prisma";

export async function cancelPendingSubscription(): Promise<{ success: boolean }> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false };
  }

  const pendingSub = await prisma.userSubscription.findFirst({
    where: { userId, status: "pending" },
  });

  if (!pendingSub) {
    return { success: false };
  }

  await prisma.userSubscription.delete({
    where: { id: pendingSub.id },
  });

  const pendingTransaction = await prisma.transaction.findFirst({
    where: { userId, paymentStatus: "pending", type: "subscription" },
    orderBy: { transactionDate: "desc" },
  });

  if (pendingTransaction) {
    await prisma.transactionDetail.deleteMany({
      where: { transactionId: pendingTransaction.transactionId },
    });
    await prisma.transaction.delete({
      where: { transactionId: pendingTransaction.transactionId },
    });
  }

  return { success: true };
}
