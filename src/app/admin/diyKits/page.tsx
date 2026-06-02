import { prisma } from "@/src/lib/prisma";
import { DiyKitList } from "@/src/features/admin/diyKits/components/DiyKitList";
import Image from "next/image";

export const metadata = {
  title: "Admin DIY Kits | Make It With Love",
};

export default async function AdminDiyKitsPage() {
  const diyKits = await prisma.diyKit.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <main className="relative flex-1 p-6 md:p-12 w-full max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-100px)]">
      <DiyKitList kits={diyKits} />

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
