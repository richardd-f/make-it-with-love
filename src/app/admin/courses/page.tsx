import { prisma } from "@/src/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Admin Courses | Make It With Love",
};

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="relative flex-1 p-6 md:p-12 w-full max-w-7xl mx-auto flex flex-col gap-8 min-h-[calc(100vh-100px)]">
      <div className="flex justify-between items-center z-10">
        <h1 className="text-5xl font-family-papernotes text-[var(--color-pink)]">Manage Courses</h1>
        <Link href="/admin/courses/new" className="px-6 py-3 bg-[var(--color-green)] hover:bg-[var(--color-pink)] text-white font-bold text-xl rounded-full shadow-md font-family-papernotes transition-colors">
          + New Course
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10">
        {courses.map(course => (
          <Link key={course.id} href={`/admin/courses/${course.id}`} className="group flex flex-col bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-white/50 shadow hover:shadow-xl hover:scale-[1.02] transition-all">
            <h3 className="text-2xl font-bold font-sans text-foreground group-hover:text-[var(--color-pink)] transition-colors">{course.name}</h3>
            <p className="text-sm text-foreground/70 line-clamp-2 mt-2 flex-1">{course.description || "No description provided."}</p>
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-sm font-semibold">
              <span className="text-[var(--color-green)]">${course.price.toFixed(2)}</span>
              <span className="text-foreground/60">{course.amountOfMeeting} Meetings</span>
            </div>
          </Link>
        ))}
        {courses.length === 0 && (
          <p className="col-span-full text-center p-12 text-lg text-foreground/60 italic bg-white/40 rounded-3xl">No courses found. Create one to get started!</p>
        )}
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed top-20 right-10 w-48 h-48 opacity-30 pointer-events-none -z-10">
        <Image src="/images/assets/coral1_pink.webp" alt="" fill className="object-contain" />
      </div>
      <div className="fixed bottom-10 left-10 w-64 h-64 opacity-20 pointer-events-none -z-10">
        <Image src="/images/assets/coral2_green.webp" alt="" fill className="object-contain" />
      </div>
    </main>
  );
}
