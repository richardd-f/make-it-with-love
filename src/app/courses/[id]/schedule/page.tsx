import { getCourseDetail } from "@/src/features/courses/actions/get-course-detail.action";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { SchedulingBoard } from "../../../../features/scheduling/components/scheduling-board";

export default async function SchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const course = await getCourseDetail(resolvedParams.id);

  if (!course) {
    return notFound();
  }

  if (!course.isOwned) {
    redirect(`/courses/${course.id}`);
  }

  return (
    <main className="min-h-screen relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 py-12 flex flex-col">
      <div className="mb-8 animate-fade-in">
        <Link
          href={`/courses/${course.id}/learn`}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#e4552c] transition-colors font-medium mb-6"
          style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Course Journey
        </Link>

        <h1 className="font-family-papernotes text-4xl sm:text-5xl text-[#f79d1c] drop-shadow-sm mb-2">
          Schedule Meeting
        </h1>
        <p className="text-lg text-gray-600" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
          Pick a time to meet with a mentor for <b>{course.title}</b>!
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/40 p-4 sm:p-8 w-full animate-fade-in delay-200">
        <SchedulingBoard courseId={course.id} />
      </div>
    </main>
  );
}
