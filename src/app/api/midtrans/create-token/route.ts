import { auth } from "@/src/auth";
import prisma from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const PLAN_NAME = "Premium Crafter MVP";
const PLAN_PRICE = 129000; // IDR — must be integer for Midtrans

export async function POST(_request: NextRequest) {
  try {
    // 1. Auth guard
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Block duplicate active/pending subscriptions
    const existing = await prisma.userSubscription.findFirst({
      where: { userId, status: { in: ["pending", "active"] } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Subscription already active or pending" },
        { status: 409 }
      );
    }

    // 3. Find-or-create the subscription plan
    let plan = await prisma.subscription.findFirst({
      where: { planName: PLAN_NAME },
    });
    if (!plan) {
      plan = await prisma.subscription.create({
        data: {
          planName: PLAN_NAME,
          description: "Unlimited course access + 2 mentor sessions/month",
          price: PLAN_PRICE,
          duration: 30,
          meetingAdditions: 2,
        },
      });
    }

    // 4. Create Transaction (pending) — transactionId becomes Midtrans order_id
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        paymentStatus: "pending",
        transactionDate: new Date(),
      },
    });
    const orderId = transaction.transactionId;

    // 5. Create TransactionDetail
    await prisma.transactionDetail.create({
      data: {
        transactionId: orderId,
        item: `${PLAN_NAME} Subscription`,
        quantity: 1,
        totalPrice: PLAN_PRICE,
      },
    });

    // 6. Create UserSubscription (status: "pending")
    await prisma.userSubscription.create({
      data: {
        userId,
        subscriptionId: plan.subscriptionId,
        startDate: new Date(),
        status: "pending",
        meetingAdditionsLeft: 0,
      },
    });

    // 7. Call Midtrans Snap API
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
    const snapUrl = isProduction
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";

    const serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";
    const encodedKey = Buffer.from(`${serverKey}:`).toString("base64");

    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(PLAN_PRICE),
      },
      item_details: [
        {
          id: plan.subscriptionId,
          price: Math.round(PLAN_PRICE),
          quantity: 1,
          name: `${PLAN_NAME} Subscription`,
        },
      ],
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
      return NextResponse.json(
        { error: "Failed to create payment token" },
        { status: 502 }
      );
    }

    const { token } = await snapResponse.json();

    // 8. Return token + orderId to client
    return NextResponse.json({ token, orderId });
  } catch (error) {
    console.error("Error in /api/midtrans/create-token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
