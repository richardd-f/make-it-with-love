"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { trackEvent } from "@/src/actions/track-event.action";

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

type PaymentState = "idle" | "success" | "pending" | "error";

interface SubscribeButtonProps {
  planName: string;
  disabled?: boolean;
}

const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
const snapUrl = isProduction
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

export function SubscribeButton({ planName, disabled = false }: SubscribeButtonProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClick = async () => {
    if (isLoading || disabled) return;

    // Guard: snap.js must be loaded
    if (typeof window === "undefined" || !window.snap) {
      setErrorMessage("Payment system is loading. Please wait a moment and try again.");
      setPaymentState("error");
      return;
    }

    setIsLoading(true);
    setPaymentState("idle");
    setErrorMessage(null);

    // Track event (fire-and-forget)
    trackEvent("BUY_SUBSCRIPTION_CLICK", planName);

    // Call create-token API
    const res = await fetch("/api/midtrans/create-token", { method: "POST" });

    if (!res.ok) {
      if (res.status === 409) {
        // Already has active/pending subscription (race condition or double-click)
        setPaymentState("pending");
        router.refresh();
      } else if (res.status === 401) {
        setErrorMessage("Please log in to subscribe.");
        setPaymentState("error");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMessage((data as { error?: string }).error ?? "Failed to start payment. Please try again.");
        setPaymentState("error");
      }
      setIsLoading(false);
      return;
    }

    const { token } = await res.json();
    setIsLoading(false);

    // Open Midtrans Snap popup
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
        // Payment record is already pending even if user closes popup
        router.refresh();
      },
    });
  };

  // Greyed-out state for already-subscribed users (passed from server)
  if (disabled) {
    return (
      <button
        disabled
        className="relative w-full overflow-hidden rounded-full py-5 px-8 font-bold text-xl bg-gray-200 text-gray-500 cursor-not-allowed"
        style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
      >
        Subscription Active or Pending
      </button>
    );
  }

  // Success state
  if (paymentState === "success") {
    return (
      <div className="w-full rounded-full py-5 px-8 font-bold text-xl bg-[#32a569] text-white text-center flex items-center justify-center gap-3"
        style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Subscribed! Thank you 🎉
      </div>
    );
  }

  // Pending state (after popup closed or pending payment)
  if (paymentState === "pending") {
    return (
      <div className="w-full rounded-full py-5 px-8 font-bold text-lg bg-amber-100 text-amber-700 text-center"
        style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
        ⏳ Payment Pending — we&apos;ll activate your subscription shortly
      </div>
    );
  }

  // Error state
  if (paymentState === "error") {
    return (
      <div className="w-full flex flex-col gap-3">
        <div className="w-full rounded-2xl py-4 px-6 bg-red-50 border border-red-200 text-red-700 text-center text-base"
          style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
          {errorMessage ?? "Something went wrong. Please try again."}
        </div>
        <button
          onClick={() => setPaymentState("idle")}
          className="w-full rounded-full py-4 px-8 font-bold text-lg bg-gradient-to-r from-[#e4552c] to-[#f79d1c] text-white"
          style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Default idle state — original button design preserved
  return (
    <>
      <Script
        src={snapUrl}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={isLoading}
        className={`relative w-full overflow-hidden rounded-full py-5 px-8 font-bold text-2xl transition-all duration-300 transform shadow-xl hover:shadow-2xl hover:-translate-y-1 ${
          isLoading
            ? "bg-gray-300 text-gray-500 cursor-wait"
            : "bg-gradient-to-r from-[#e4552c] to-[#f79d1c] text-white"
        }`}
        style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
      >
        <div className="relative z-10 flex items-center justify-center gap-3">
          {isLoading ? (
            <>
              <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Processing...
            </>
          ) : (
            <>
              <span className="tracking-wide">Subscribe Now</span>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-300 ${isHovered ? "translate-x-2" : ""}`}
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </>
          )}
        </div>

        {/* Shine effect */}
        <div
          className={`absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ${
            isHovered ? "translate-x-full" : ""
          }`}
        />
      </button>
    </>
  );
}
