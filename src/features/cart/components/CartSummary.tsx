import { ICartItem } from "../interfaces/cart.types";
import { CartPayButton } from "./CartPayButton";

export function CartSummary({ items }: { items: ICartItem[] }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#f6e5c4] p-6 flex flex-col gap-5 sticky top-32">
      <h2 className="text-2xl font-bold font-family-papernotes text-gray-800">Order Summary</h2>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.cartId} className="flex justify-between items-start gap-2">
            <span className="text-sm text-gray-600 leading-tight flex-1 min-w-0 truncate">
              {item.title}
            </span>
            <span className="text-sm font-semibold text-gray-800 flex-shrink-0">
              Rp {item.price.toLocaleString("id-ID")}
            </span>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <>
          <div className="border-t border-dashed border-[#f6e5c4] pt-4 flex justify-between items-center">
            <span className="font-bold text-gray-800 text-lg">Total</span>
            <span className="font-extrabold text-[#32a569] text-2xl">
              Rp {total.toLocaleString("id-ID")}
            </span>
          </div>

          <CartPayButton items={items} />

          <p className="text-xs text-center text-gray-400">
            Secure payment via Midtrans · 30-day happiness guarantee
          </p>
        </>
      )}
    </div>
  );
}
