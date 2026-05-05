import { prisma } from "@/src/lib/prisma";
import { CourseForm } from "@/src/features/admin/courses/components/CourseForm";
import { CategoryDropdown } from "@/src/features/admin/courses/components/CategoryDropdown";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Course | Make It With Love",
};

export default async function AdminCourseDetailPage({ params }: { params: { courseId: string } }) {
  const isNew = params.courseId === 'new';

  let course = null;
  let assignedCategoryIds: string[] = [];

  if (!isNew) {
    course = await prisma.course.findUnique({
      where: { id: params.courseId },
      include: {
        courseCategories: true,
      }
    });

    if (!course) {
      notFound();
    }

    assignedCategoryIds = course.courseCategories.map(cc => cc.categoryId);
  }

  const allCategories = await prisma.category.findMany({
    orderBy: { category: 'asc' }
  });

  return (
    <main className="flex-1 p-6 md:p-12 w-full max-w-4xl mx-auto flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6">
        <Link href="/admin/courses" className="text-[var(--color-pink)] font-bold hover:underline">
          &larr; Back to Courses
        </Link>
        {!isNew && (
          <Link href={`/admin/courses/${params.courseId}/diyKits`} className="px-6 py-2 bg-[var(--color-orange)] hover:bg-[var(--color-red)] text-white font-bold rounded-full shadow-md font-family-papernotes transition-colors">
            Manage DIY Kits
          </Link>
        )}
      </div>

      <CourseForm course={course || undefined} />
      
      {!isNew && (
        <CategoryDropdown 
          courseId={params.courseId} 
          allCategories={allCategories} 
          assignedCategoryIds={assignedCategoryIds} 
        />
      )}
    </main>
  );
}
