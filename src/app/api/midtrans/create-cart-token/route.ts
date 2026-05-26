import { auth } from "@/src/auth";
import prisma from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { course: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    type CartWithCourse = { courseId: string; course: { price: number; name: string } };
    const grossAmount = (cartItems as CartWithCourse[]).reduce(
      (sum: number, item: CartWithCourse) => sum + item.course.price,
      0
    );

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        paymentStatus: "pending",
        transactionDate: new Date(),
        type: "course",
      },
    });
    const orderId = transaction.transactionId;

    await prisma.transactionDetail.createMany({
      data: (cartItems as CartWithCourse[]).map((item: CartWithCourse) => ({
        transactionId: orderId,
        courseId: item.courseId,
        item: item.course.name,
        quantity: 1,
        totalPrice: item.course.price,
      })),
    });

    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
    const snapUrl = isProduction
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";

    const serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";
    const encodedKey = Buffer.from(`${serverKey}:`).toString("base64");

    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(grossAmount),
      },
      item_details: (cartItems as CartWithCourse[]).map((item: CartWithCourse) => ({
        id: item.courseId,
        price: Math.round(item.course.price),
        quantity: 1,
        name: item.course.name,
      })),
      ...(session.user?.email
        ? { customer_details: { email: session.user.email } }
        : {}),
    };

    const snapResponse = await fetch(snapUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!snapResponse.ok) {
      const errBody = await snapResponse.text();
      console.error("Midtrans Snap API error:", errBody);
      await prisma.transaction.delete({ where: { transactionId: orderId } });
      return NextResponse.json({ error: "Failed to create payment token" }, { status: 502 });
    }

    const { token } = await snapResponse.json();
    return NextResponse.json({ token, orderId });
  } catch (error) {
    console.error("Error in /api/midtrans/create-cart-token:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
