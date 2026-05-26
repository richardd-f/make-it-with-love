import crypto from "crypto";
import prisma from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const SUCCESS_STATUSES = ["settlement", "capture"] as const;
const FAILURE_STATUSES = ["cancel", "deny", "expire", "failure"] as const;

export async function POST(request: NextRequest) {
  // Always return 200 to prevent Midtrans from retrying on server errors
  try {
    const body = await request.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = body;

    // 1. Verify Midtrans signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";
    const expectedSignature = crypto
      .createHash("sha512")
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest("hex");

    if (signature_key !== expectedSignature) {
      console.warn("Midtrans webhook: invalid signature for order", order_id);
      return NextResponse.json({ message: "Invalid signature" }, { status: 200 });
    }

    // 2. Find the Transaction by order_id (which is the transactionId UUID)
    const transaction = await prisma.transaction.findUnique({
      where: { transactionId: order_id },
    });
    if (!transaction) {
      console.warn("Midtrans webhook: transaction not found for order", order_id);
      return NextResponse.json({ message: "Transaction not found" }, { status: 200 });
    }

    // 3. Update Transaction payment status
    await prisma.transaction.update({
      where: { transactionId: order_id },
      data: { paymentStatus: transaction_status },
    });

    const isFraud = fraud_status === "fraud";
    const isSuccess =
      (SUCCESS_STATUSES as readonly string[]).includes(transaction_status) && !isFraud;
    const isFailure =
      (FAILURE_STATUSES as readonly string[]).includes(transaction_status) || isFraud;

    if (transaction.type === "course") {
      // 4a. Course purchase: enroll user in each purchased course
      if (isSuccess) {
        const details = await prisma.transactionDetail.findMany({
          where: { transactionId: order_id },
        });

        const courseIds = details
          .map((d: { courseId: string | null }) => d.courseId)
          .filter((id: string | null): id is string => id !== null);

        const courses = await prisma.course.findMany({
          where: { id: { in: courseIds } },
          select: { id: true, amountOfMeeting: true },
        });

        const courseMap = new Map(courses.map((c: { id: string; amountOfMeeting: number }) => [c.id, c.amountOfMeeting]));

        for (const courseId of courseIds) {
          const existing = await prisma.enrollment.findFirst({
            where: { userId: transaction.userId, courseId },
          });
          if (!existing) {
            await prisma.enrollment.create({
              data: {
                userId: transaction.userId,
                courseId,
                meetingsAmountLeft: courseMap.get(courseId) ?? 0,
              },
            });
          }
        }

        // Clear purchased courses from cart
        await prisma.cart.deleteMany({
          where: { userId: transaction.userId, courseId: { in: courseIds } },
        });
      }
    } else {
      // 4b. Subscription purchase: activate or cancel
      if (isSuccess) {
        await prisma.userSubscription.updateMany({
          where: { userId: transaction.userId, status: "pending" },
          data: { status: "active", meetingAdditionsLeft: 2 },
        });
      }
      if (isFailure) {
        await prisma.userSubscription.updateMany({
          where: { userId: transaction.userId, status: "pending" },
          data: { status: "cancelled" },
        });
      }
    }

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/midtrans/webhook:", error);
    // Still return 200 to prevent Midtrans retry loop
    return NextResponse.json({ message: "Internal error" }, { status: 200 });
  }
}
