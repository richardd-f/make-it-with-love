import { getCourseDetail } from "@/src/features/courses/actions/get-course-detail.action";
import { notFound, redirect } from "next/navigation";
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
      <div className="text-center mb-16">
        <h1 className="font-family-papernotes text-5xl sm:text-6xl text-[#32a569] drop-shadow-md mb-4">
          {course.title} Journey
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
          Follow the path to complete your creative adventure! Watch the videos one by one.
        </p>
      </div>

      <CourseLearningPath course={course} />
    </main>
  );
}
