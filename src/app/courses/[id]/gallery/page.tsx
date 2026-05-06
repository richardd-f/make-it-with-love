import { getCourseDetail } from "@/src/features/courses/actions/get-course-detail.action";
import { getGalleryPosts } from "@/src/features/gallery/actions/get-gallery.action";
import { MasonryGrid } from "@/src/features/gallery/components/masonry-grid";
import { AddPostButton } from "@/src/features/gallery/components/add-post-button";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CourseGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const course = await getCourseDetail(resolvedParams.id);

  if (!course) {
    return notFound();
  }

  const posts = await getGalleryPosts(course.id);

  return (
    <main className="min-h-screen relative z-10 w-full flex flex-col items-center py-12 pb-32">
      
      {/* Header */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 mb-12 text-center animate-fade-in">
        <Link 
          href={`/courses/${course.id}`}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#e4552c] transition-colors font-medium mb-6"
          style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Course
        </Link>

        <h1 className="font-family-papernotes text-5xl sm:text-7xl text-[#f79d1c] drop-shadow-sm mb-4">
          Student Gallery
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
          Check out the amazing <span className="font-bold text-[#ea7c9d]">{course.title}</span> crafts made by other creative kids!
        </p>
      </div>

      {/* Masonry Grid */}
      <div className="w-full animate-fade-in [animation-delay:200ms]">
        <MasonryGrid posts={posts} courseId={course.id} />
      </div>

      {/* Floating Add Post Button (Only for Enrolled Users) */}
      {course.isOwned && <AddPostButton courseId={course.id} />}
      
    </main>
  );
}
