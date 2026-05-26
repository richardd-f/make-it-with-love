import Link from "next/link";
import { getCartItems } from "@/src/features/cart/actions/get-cart-items.action";
import { CartItemList } from "@/src/features/cart/components/CartItemList";
import { CartSummary } from "@/src/features/cart/components/CartSummary";

export default async function CartPage() {
  const items = await getCartItems();

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <div className="flex flex-col items-center justify-center p-12 text-center bg-[#f6e5c4]/10 rounded-3xl border-2 border-dashed border-[#f6e5c4] max-w-md w-full">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-3xl font-bold font-family-papernotes text-[#e4552c] mb-3">
            Your Cart is Empty
          </h2>
          <p className="text-gray-500 mb-8 text-sm">
            Looks like you haven&apos;t added any courses yet. Browse our collection and find something you love!
          </p>
          <Link
            href="/courses"
            className="px-8 py-3 bg-[#32a569] text-white font-bold rounded-full hover:bg-[#288a56] transition-colors shadow-md"
          >
            Browse Courses
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-12 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold font-family-papernotes text-gray-800 mb-8">
        Your Cart ({items.length} {items.length === 1 ? "course" : "courses"})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        <CartItemList items={items} />
        <CartSummary items={items} />
      </div>
    </main>
  );
}
