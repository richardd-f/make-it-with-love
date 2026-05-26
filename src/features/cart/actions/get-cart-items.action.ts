"use server";

import prisma from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import { ICartItem } from "../interfaces/cart.types";

export async function getCartItems(): Promise<ICartItem[]> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];

  const rows = await prisma.cart.findMany({
    where: { userId },
    include: { course: true },
    orderBy: { createdAt: "asc" },
  });

  type CartRow = { cartId: string; courseId: string; createdAt: Date; course: { name: string; imgUrl: string | null; price: number; amountOfMeeting: number } };
  return (rows as CartRow[]).map((row: CartRow) => ({
    cartId: row.cartId,
    courseId: row.courseId,
    title: row.course.name,
    thumbnailUrl: row.course.imgUrl,
    price: row.course.price,
    amountOfMeeting: row.course.amountOfMeeting,
    createdAt: row.createdAt,
  }));
}
