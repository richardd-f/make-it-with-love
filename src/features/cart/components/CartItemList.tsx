"use client";

import Image from "next/image";
import { useTransition } from "react";
import { toast } from "react-toastify";
import { ICartItem } from "../interfaces/cart.types";
import { removeFromCart } from "../actions/remove-from-cart.action";

export function CartItemList({ items }: { items: ICartItem[] }) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = (cartId: string) => {
    startTransition(async () => {
      const result = await removeFromCart(cartId);
      if (result.success) {
        toast.success("Removed from cart.");
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <div
          key={item.cartId}
          className="flex gap-4 items-center bg-white rounded-2xl p-4 shadow-sm border border-[#f6e5c4]"
        >
          <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#f6e5c4]">
            {item.thumbnailUrl ? (
              <Image
                src={item.thumbnailUrl}
                alt={item.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">🎨</div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 text-base leading-tight truncate">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {item.amountOfMeeting} mentor session{item.amountOfMeeting !== 1 ? "s" : ""} included
            </p>
            <p className="text-[#32a569] font-bold text-lg mt-1">
              Rp {item.price.toLocaleString("id-ID")}
            </p>
          </div>

          <button
            onClick={() => handleRemove(item.cartId)}
            disabled={isPending}
            aria-label="Remove from cart"
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
