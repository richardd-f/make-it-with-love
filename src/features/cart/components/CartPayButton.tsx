"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { ICartItem } from "../interfaces/cart.types";

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
const snapUrl = isProduction
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

type PaymentState = "idle" | "success" | "pending" | "error";

export function CartPayButton({ items }: { items: ICartItem[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePay = async () => {
    if (isLoading || items.length === 0) return;

    if (typeof window === "undefined" || !window.snap) {
      setErrorMessage("Payment system is loading. Please wait a moment and try again.");
      setPaymentState("error");
      return;
    }

    setIsLoading(true);
    setPaymentState("idle");
    setErrorMessage(null);

    const res = await fetch("/api/midtrans/create-cart-token", { method: "POST" });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setErrorMessage("Please log in to continue.");
      } else {
        setErrorMessage((data as { error?: string }).error ?? "Failed to start payment. Please try again.");
      }
      setPaymentState("error");
      setIsLoading(false);
      return;
    }

    const { token } = await res.json();
    setIsLoading(false);

    window.snap.pay(token, {
      onSuccess: () => {
        setPaymentState("success");
        router.refresh();
      },
      onPending: () => {
        setPaymentState("pending");
        router.refresh();
      },
      onError: () => {
        setErrorMessage("Payment failed. Please try again.");
        setPaymentState("error");
      },
      onClose: () => {
        router.refresh();
      },
    });
  };

  if (paymentState === "success") {
    return (
      <div className="w-full rounded-2xl py-5 px-8 font-bold text-xl bg-[#32a569] text-white text-center flex items-center justify-center gap-3">
        Payment successful! Enjoy your courses 🎉
      </div>
    );
  }

  if (paymentState === "pending") {
    return (
      <div className="w-full rounded-2xl py-5 px-8 font-bold text-base bg-amber-100 text-amber-700 text-center">
        ⏳ Payment pending — we&apos;ll enroll you shortly
      </div>
    );
  }

  if (paymentState === "error") {
    return (
      <div className="flex flex-col gap-3">
        <div className="w-full rounded-2xl py-4 px-6 bg-red-50 border border-red-200 text-red-700 text-center text-sm">
          {errorMessage ?? "Something went wrong. Please try again."}
        </div>
        <button
          onClick={() => setPaymentState("idle")}
          className="w-full rounded-full py-4 px-8 font-bold text-lg bg-[#32a569] text-white hover:bg-[#288a56] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <Script
        src={snapUrl}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />
      <button
        onClick={handlePay}
        disabled={isLoading || items.length === 0}
        className="w-full bg-[#32a569] hover:bg-[#288a56] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-xl py-5 rounded-full shadow-lg hover:scale-105 transition-all font-family-papernotes uppercase tracking-widest"
      >
        {isLoading ? "Processing…" : "Pay Now"}
      </button>
    </>
  );
}
