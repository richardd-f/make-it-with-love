import { getCourseDetail } from "@/src/features/courses/actions/get-course-detail.action";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CourseLearningPath } from "../../../../features/courses/components/course-learning-path";

export default async function LearnPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const course = await getCourseDetail(resolvedParams.id);

  if (!course) {
    return notFound();
  }

  if (!course.isOwned) {
    redirect(`/courses/${course.id}`);
  }

  return (
    <main className="min-h-screen relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 py-12 flex flex-col items-center">
      <div className="text-center mb-12">
        <h1 className="font-family-papernotes text-5xl sm:text-6xl text-[#32a569] drop-shadow-md mb-4">
          {course.title} Journey
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
          Follow the path to complete your creative adventure! Watch the videos one by one.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-4">
          <Link 
            href={`/courses/${course.id}/schedule`}
            className="inline-flex items-center gap-2 bg-[#f79d1c] hover:bg-[#e4552c] text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Schedule a Mentor Meeting!
          </Link>
          <Link 
            href={`/courses/${course.id}/gallery`}
            className="inline-flex items-center gap-2 bg-[#ea7c9d] hover:bg-[#c65d7c] text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            Student Gallery
          </Link>
        </div>
      </div>

      <CourseLearningPath course={course} />
    </main>
  );
}
