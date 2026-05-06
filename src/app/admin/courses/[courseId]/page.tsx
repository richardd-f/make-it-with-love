import { prisma } from "@/src/lib/prisma";
import { CourseForm } from "@/src/features/admin/courses/components/CourseForm";
import { CategoryDropdown } from "@/src/features/admin/courses/components/CategoryDropdown";
import { CourseVideoManager } from "@/src/features/admin/courses/components/CourseVideoManager";
import { CourseDiyKitManager } from "@/src/features/admin/diyKits/components/CourseDiyKitManager";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Course | Make It With Love",
};

export default async function AdminCourseDetailPage(props: { params: Promise<{ courseId: string }> }) {
  const params = await props.params;
  const courseId = params.courseId;
  const isNew = courseId === 'new';

  let course = null;
  let assignedCategoryIds: string[] = [];
  let assignedKitIds: string[] = [];

  if (!isNew) {
    course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        courseCategories: true,
        courseKits: true,
        videos: {
          orderBy: { title: 'asc' }
        }
      }
    });

    if (!course) {
      notFound();
    }

    assignedCategoryIds = course.courseCategories.map(cc => cc.categoryId);
    assignedKitIds = course.courseKits.map(ck => ck.diyKitsId);
  }

  const allCategories = await prisma.category.findMany({
    orderBy: { category: 'asc' }
  });

  const allKits = await prisma.diyKit.findMany({
    orderBy: { name: 'asc' }
  });

  const mentors = await prisma.mentor.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  });

  return (
    <main className="flex-1 p-6 md:p-12 w-full max-w-4xl mx-auto flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6">
        <Link href="/admin/courses" className="text-[var(--color-pink)] font-bold hover:underline">
          &larr; Back to Courses
        </Link>
      </div>

      <CourseForm course={course || undefined} mentors={mentors} />
      
      {!isNew && (
        <>
          <CategoryDropdown 
            courseId={courseId} 
            allCategories={allCategories} 
            assignedCategoryIds={assignedCategoryIds} 
          />
          <CourseDiyKitManager 
            courseId={courseId}
            allKits={allKits}
            assignedKitIds={assignedKitIds}
          />
          <CourseVideoManager 
            courseId={courseId}
            videos={course?.videos || []}
          />
        </>
      )}
    </main>
  );
}
