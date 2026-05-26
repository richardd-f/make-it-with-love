"use server";

import prisma from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import { revalidatePath } from "next/cache";

export async function removeFromCart(
  cartId: string
): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, message: "Unauthorized." };
  }

  const item = await prisma.cart.findUnique({ where: { cartId } });
  if (!item || item.userId !== userId) {
    return { success: false, message: "Cart item not found." };
  }

  await prisma.cart.delete({ where: { cartId } });
  revalidatePath("/cart");
  return { success: true, message: "Removed from cart." };
}
