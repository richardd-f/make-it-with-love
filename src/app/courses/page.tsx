export const metadata = {
  title: 'Explore Our Courses | Make It With Love',
  description: 'Browse our catalog of creative courses for kids.',
};

import { CoursesExplorer } from "../../features/courses/components/courses-explorer";

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-[#fffbeg] relative overflow-hidden" style={{ backgroundColor: '#fffbe6' }}>
      
      {/* Scattered Decorations */}
      <img src="/images/assets/circle_green.webp" alt="" className="absolute top-20 left-10 w-24 h-24 opacity-80 z-0 select-none animate-pulse" style={{ animationDuration: '4s' }} />
      <img src="/images/assets/coral1_pink.webp" alt="" className="absolute top-40 right-10 w-32 h-32 opacity-70 z-0 select-none" />
      <img src="/images/assets/circle_yellow.webp" alt="" className="absolute top-[40%] left-4 w-16 h-16 opacity-80 z-0 select-none animate-bounce" />
      <img src="/images/assets/coral2_orange.webp" alt="" className="absolute top-[60%] right-12 w-40 h-40 opacity-70 z-0 select-none" />
      <img src="/images/assets/circle_red.webp" alt="" className="absolute bottom-20 left-20 w-20 h-20 opacity-80 z-0 select-none" />
      <img src="/images/assets/coral1_green.webp" alt="" className="absolute -bottom-10 right-40 w-48 h-48 opacity-60 z-0 select-none" />

      {/* Header Section */}
      <div className="pt-20 pb-16 relative z-10 w-full text-center">        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center text-sm font-black text-[#e4552c] mb-6 uppercase tracking-widest" aria-label="Breadcrumb" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
            <ol className="flex items-center space-x-3">
              <li><a href="/" className="hover:text-black transition-colors bg-white/50 px-4 py-2 rounded-full shadow-sm">Home</a></li>
              <li><span>👉</span></li>
              <li className="text-white bg-[#e4552c] px-4 py-2 rounded-full shadow-sm" aria-current="page">Courses</li>
            </ol>
          </nav>
          <h1 className="text-6xl md:text-7xl font-extrabold text-[#32a569] font-family-papernotes drop-shadow-md">
            Explore Details!
          </h1>
          <p className="mt-6 text-2xl text-gray-700 max-w-2xl mx-auto font-bold" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
            Find the perfect creative class for your kids!
          </p>
        </div>
      </div>

      <div className="relative z-20 pb-20">
        <CoursesExplorer />
      </div>
    </div>
  );
}
