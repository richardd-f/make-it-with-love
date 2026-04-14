export const metadata = {
  title: 'Explore Our Courses | Make It With Love',
  description: 'Browse our catalog of creative courses for kids.',
};

import { CoursesExplorer } from "../../features/courses/components/courses-explorer";
import { BreadcrumbList } from "@/src/components/ui/breadcrumbs";

import Link from "next/link";

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-[#fffbeg] relative overflow-x-hidden">

      {/* Scattered Decorations */}
      {/* Header Section */}
      <div className="pt-20 pb-16 relative z-10 w-full text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-6">
            <BreadcrumbList
              items={[
                { label: "Home", href: "/" },
                { label: "Courses", active: true }
              ]}
            />
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-[#32a569] font-family-papernotes drop-shadow-md">
            Explore Courses!
          </h1>
          <p className="mt-6 text-2xl text-gray-700 max-w-2xl mx-auto font-bold" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
            Find the perfect creative class for you!
          </p>
        </div>
      </div>

      <div className="relative z-20 pb-20">
        <CoursesExplorer />
      </div>
    </div >
  );
}
