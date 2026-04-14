export const metadata = {
  title: 'Explore Our Courses | Make It With Love',
  description: 'Browse our catalog of creative courses for kids.',
};

import { CoursesExplorer } from "../../features/courses/components/courses-explorer";

import Link from "next/link";

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-[#fffbeg] relative overflow-x-hidden">

      {/* Scattered Decorations */}
      {/* Header Section */}
      <div className="pt-20 pb-16 relative z-10 w-full text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center text-sm font-black text-[#e4552c] mb-6 uppercase tracking-widest" aria-label="Breadcrumb" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
            <ol className="flex items-center space-x-3">
              <li><Link href="/" className="hover:text-black transition-colors bg-white/50 px-4 py-2 rounded-full shadow-sm">Home</Link></li>
              <li><span> - </span></li>
              <li className="text-white bg-[#e4552c] px-4 py-2 rounded-full shadow-sm" aria-current="page">Courses</li>
            </ol>
          </nav>
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
