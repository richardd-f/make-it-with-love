import { getCourseDetail } from "@/src/features/courses/actions/get-course-detail.action";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CourseLearningPath } from "../../../../features/courses/components/course-learning-path";
import { BookZoomButton } from "@/src/features/courses/components/book-zoom-button";
import { ShowOffCraftInlineButton } from "@/src/features/gallery/components/show-off-craft-inline-button";

export default async function LearnPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const course = await getCourseDetail(resolvedParams.id);

  if (!course) {
    return notFound();
  }

  if (!course.isOwned && !course.isSubscribed) {
    redirect(`/courses/${course.id}`);
  }

  return (
    <main className="min-h-screen relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 py-12 flex flex-col items-center">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="font-family-papernotes text-5xl sm:text-6xl text-[#32a569] drop-shadow-md mb-4">
          {course.title} Journey
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
          Follow the path to complete your creative adventure! Watch the videos one by one.
        </p>
        <div className="flex flex-wrap gap-3 items-center justify-center mt-4">
          <Link
            href={`/courses/${course.id}/gallery`}
            className="inline-flex items-center gap-2 bg-[#ea7c9d] hover:bg-[#c65d7c] text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 whitespace-nowrap"
            style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            Gallery
          </Link>
          <BookZoomButton courseId={course.id} />
          <ShowOffCraftInlineButton courseId={course.id} />
        </div>
      </div>

      <div className="w-full animate-fade-in delay-200">
        <CourseLearningPath course={course} />
      </div>
    </main>
  );
}
