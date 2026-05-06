import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCourseDetail } from "@/src/features/courses/actions/get-course-detail.action";
import { BreadcrumbList } from "@/src/components/ui/breadcrumbs";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string; videoId: string }>;
}) {
  const resolvedParams = await params;
  const course = await getCourseDetail(resolvedParams.id);

  if (!course) {
    return notFound();
  }

  // Test mode: Everyone can access the learning path
  // if (!course.isOwned) {
  //   redirect(`/courses/${course.id}`);
  // }

  const currentIndex = course.contents.findIndex((c) => c.id === resolvedParams.videoId);

  if (currentIndex === -1) {
    return notFound();
  }

  const currentContent = course.contents[currentIndex];
  const nextContent = course.contents[currentIndex + 1]; // Might be undefined

  return (
    <main className="min-h-screen relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 py-12">
      {/* Breadcrumbs */}
      <div className="mb-8">
        <BreadcrumbList
          items={[
            { label: "My Courses", href: "/myCourse" },
            { label: course.title, href: `/courses/${course.id}/learn` },
            { label: currentContent.title, active: true },
          ]}
        />
      </div>

      <div className="flex flex-col gap-8">
        {/* Title & Video */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-gray-100">
          <h1 className="font-family-papernotes text-4xl text-gray-800 mb-6 px-2">
            {currentContent.title}
          </h1>
          
          <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black/5 relative shadow-inner">
            <video
              className="w-full h-full object-cover"
              controls
              poster={course.thumbnailUrl}
            >
              <source src={currentContent.videoUrl || course.videoPreviewUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Info & Next Button Row */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Description */}
          <div className="flex-1 bg-white rounded-3xl p-8 shadow-md border border-gray-100">
            <h2 className="font-family-papernotes text-2xl text-[#f79d1c] mb-4">
              About This Lesson
            </h2>
            <p
              className="text-gray-600 leading-relaxed"
              style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
            >
              In this lesson, we will explore the techniques to create your masterpiece! 
              Make sure you have your tools ready from the starter kit. Pause the video 
              whenever you need to catch up, and remember, there are no mistakes in art—only 
              happy little accidents!
            </p>
          </div>

          {/* Action Card */}
          <div className="w-full lg:w-80 flex-shrink-0 bg-white rounded-3xl p-8 shadow-md border border-gray-100 flex flex-col items-center text-center">
            {nextContent ? (
              <>
                <div className="w-16 h-16 rounded-full bg-[#f6e5c4] flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ea7c9d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-2" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>Up Next</h3>
                <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
                  {nextContent.title}
                </p>
                <Link
                  href={`/courses/${course.id}/learn/${nextContent.id}`}
                  className="w-full py-3.5 rounded-xl bg-[#32a569] text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
                >
                  Next Lesson
                </Link>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-[#f6e5c4] flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#32a569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-2" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>Course Complete!</h3>
                <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
                  You've watched all the lessons!
                </p>
                <Link
                  href={`/courses/${course.id}/learn`}
                  className="w-full py-3.5 rounded-xl bg-[#f79d1c] text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
                >
                  Back to Path
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
