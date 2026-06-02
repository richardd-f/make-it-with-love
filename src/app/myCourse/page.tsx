import Link from "next/link";
import { getEnrolledCourses } from "@/src/features/courses/actions/get-enrolled-courses.action";
import { EnrolledCoursesCarousel } from "@/src/features/courses/components/enrolled-courses-carousel";

export const metadata = {
  title: "My Art & Craft Journey | Make It With Love",
  description: "View your enrolled courses and continue your creative journey.",
};

export default async function MyCoursesPage() {
  const courses = await getEnrolledCourses();

  return (
    <main className="min-h-screen relative z-10 flex flex-col items-center">
      {/* Hero Title */}
      <div className="pt-24 pb-8 text-center px-4 animate-fade-in">
        <h1 className="font-family-papernotes text-5xl sm:text-6xl md:text-7xl text-[#32a569] drop-shadow-md">
          My Art &amp; Craft Journey
        </h1>
        <p
          className="mt-4 text-base sm:text-lg text-gray-500 max-w-md mx-auto"
          style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
        >
          Pick up where you left off!
        </p>
      </div>

      {/* Carousel or Empty State */}
      {courses.length > 0 ? (
        <div className="w-full max-w-7xl pb-20 animate-fade-in delay-200">
          <EnrolledCoursesCarousel courses={courses} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 py-20 px-4 text-center animate-fade-in delay-200">
          <div className="w-24 h-24 rounded-full bg-[#32a569]/10 flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#32a569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <line x1="12" y1="8" x2="12" y2="14" />
              <line x1="9" y1="11" x2="15" y2="11" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
            You haven&apos;t enrolled in any courses yet.
          </p>
          <Link
            href="/courses"
            className="px-8 py-3 rounded-2xl bg-[#32a569] text-white font-bold text-sm tracking-wide hover:shadow-lg transition-all duration-300 hover:scale-105"
            style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
          >
            Explore Courses
          </Link>
        </div>
      )}
    </main>
  );
}
