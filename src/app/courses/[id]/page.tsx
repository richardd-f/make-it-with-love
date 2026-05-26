import React from "react";
import Link from "next/link";
import { getCourseDetail } from "@/src/features/courses/actions/get-course-detail.action";
import { CourseHero } from "@/src/features/courses/components/course-hero";
import { StarterKitCard } from "@/src/features/courses/components/starter-kit-card";
import { CourseCurriculum } from "@/src/features/courses/components/course-curriculum";
import { CourseGalleryPreview } from "@/src/features/gallery/components/course-gallery-preview";
import { getGalleryPosts } from "@/src/features/gallery/actions/get-gallery.action";
import { CourseCtaBox } from "@/src/features/courses/components/course-cta-box";
import { BreadcrumbList } from "@/src/components/ui/breadcrumbs";
import { notFound } from "next/navigation";

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const course = await getCourseDetail(resolvedParams.id);
  
  if (!course) {
    return notFound();
  }

  const galleryPosts = await getGalleryPosts(course.id);

  // Enrolled users go straight to the learning page.
  // Subscribers (not enrolled) stay here and see a "Start Learning" button.
  if (course.isOwned) {
    const { redirect } = await import("next/navigation");
    redirect(`/courses/${course.id}/learn`);
  }

  return (
    <main className="min-h-screen relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-12">
      
      {/* Breadcrumbs */}
      <div className="mb-8">
        <BreadcrumbList 
          items={[
            { label: "Home", href: "/" },
            { label: "Courses", href: "/courses" },
            { label: course.title, active: true }
          ]} 
        />
      </div>

      {/* Hero Unit spanning full width on top */}
      <CourseHero course={course} />

      {/* Split layout: Details Main vs Sidebar CTA */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative items-start">
        
        {/* Main Content Column */}
        <div className="flex-1 w-full min-w-0 flex flex-col gap-12">
          {/* Starter Kit Section */}
          <StarterKitCard starterKit={course.starterKit} />
          
          {/* Curriculum Section */}
          <CourseCurriculum contents={course.contents} />

          {/* Student's Gallery Preview Section (Replaces Reviews) */}
          <CourseGalleryPreview posts={galleryPosts} courseId={course.id} />
        </div>

        {/* Sidebar Sticky Column */}
        <div className="w-full lg:w-[450px] flex-shrink-0 lg:sticky lg:top-32">
          <CourseCtaBox course={course} />
        </div>

      </div>

    </main>
  );
}
