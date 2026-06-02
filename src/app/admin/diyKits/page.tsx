import { prisma } from "@/src/lib/prisma";
import { DiyKitForm } from "@/src/features/admin/diyKits/components/DiyKitForm";
import Image from "next/image";

export const metadata = {
  title: "Admin DIY Kits | Make It With Love",
};

export default async function AdminDiyKitsPage() {
  const diyKits = await prisma.diyKit.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <main className="relative flex-1 p-6 md:p-12 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-8 min-h-[calc(100vh-100px)]">
      
      {/* Left Column: Form */}
      <div className="w-full md:w-1/3 z-10 animate-fade-in">
        <div className="sticky top-12">
          <DiyKitForm />
        </div>
      </div>

      {/* Right Column: List */}
      <div className="w-full md:w-2/3 flex flex-col gap-6 z-10 animate-fade-in delay-200">
        <h1 className="text-5xl font-family-papernotes text-[var(--color-orange)] drop-shadow-sm mb-4">Manage DIY Kits</h1>
        
        <div className="flex flex-wrap gap-4">
          {diyKits.map(kit => (
            <div key={kit.id} className="group flex flex-col bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-white/50 shadow hover:shadow-lg transition-all relative w-full sm:w-[calc(50%-8px)]">
              <h3 className="text-xl font-bold font-sans text-foreground">{kit.name}</h3>
              <p className="text-sm text-foreground/70 line-clamp-2 mt-1 flex-1">{kit.description || "No description"}</p>
              <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-sm font-semibold">
                <span className="text-[var(--color-orange)]">${kit.price.toFixed(2)}</span>
                <span className="text-foreground/60">Stock: {kit.stock}</span>
              </div>
            </div>
          ))}
          {diyKits.length === 0 && (
            <p className="w-full text-center p-8 text-foreground/60 italic bg-white/40 rounded-3xl border border-dashed border-gray-300">No DIY Kits found. Add some using the form!</p>
          )}
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed bottom-20 right-20 w-48 h-48 opacity-20 pointer-events-none -z-10">
        <Image src="/images/assets/coral1_orange.webp" alt="" fill className="object-contain" />
      </div>
      <div className="fixed top-10 right-1/3 w-24 h-24 opacity-30 pointer-events-none -z-10">
        <Image src="/images/assets/circle_yellow.webp" alt="" fill className="object-contain" />
      </div>
    </main>
  );
}
