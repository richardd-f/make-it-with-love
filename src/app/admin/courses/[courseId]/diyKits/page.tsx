import { prisma } from "@/src/lib/prisma";
import { CourseDiyKitManager } from "@/src/features/admin/diyKits/components/CourseDiyKitManager";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

export const metadata = {
  title: "Manage Course DIY Kits | Make It With Love",
};

export default async function AdminCourseDiyKitsPage(props: { params: Promise<{ courseId: string }> }) {
  const params = await props.params;
  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: {
      courseKits: true,
    }
  });

  if (!course) {
    notFound();
  }

  const allKits = await prisma.diyKit.findMany({
    orderBy: { name: 'asc' }
  });

  const assignedKitIds = course.courseKits.map(ck => ck.diyKitsId);

  return (
    <main className="relative flex-1 p-6 md:p-12 w-full max-w-5xl mx-auto flex flex-col items-center min-h-[calc(100vh-100px)]">
      <div className="w-full flex flex-col items-start mb-2 z-10">
        <Link href={`/admin/courses/${params.courseId}`} className="text-[var(--color-orange)] font-bold hover:underline mb-4">
          &larr; Back to Course Details
        </Link>
        <h1 className="text-4xl font-family-papernotes text-[var(--color-orange)]">
          DIY Kits for: <span className="text-foreground">{course.name}</span>
        </h1>
      </div>

      <div className="w-full z-10">
        <CourseDiyKitManager 
          courseId={params.courseId} 
          allKits={allKits} 
          assignedKitIds={assignedKitIds} 
        />
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed bottom-10 right-10 w-48 h-48 opacity-20 pointer-events-none -z-10">
        <Image src="/images/assets/coral1_orange.webp" alt="" fill className="object-contain" />
      </div>
    </main>
  );
}
