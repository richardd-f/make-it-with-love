import { getAllCoursesForTeacher } from "@/src/features/teacher/actions/get-teacher-courses.action";
import { TeacherCourseBrowser } from "@/src/features/teacher/components/TeacherCourseBrowser";

export const metadata = {
  title: "Teacher — Browse Courses | Make It With Love",
};

export default async function TeacherHomePage() {
  const courses = await getAllCoursesForTeacher();

  const typed = courses.map((c) => ({
    ...c,
    enrollmentStatus: c.enrollmentStatus as
      | "PENDING"
      | "ACCEPTED"
      | "REJECTED"
      | null,
  }));

  return (
    <main className="min-h-screen relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="mb-10 animate-fade-in">
        <h1 className="text-6xl font-family-papernotes text-gray-800 mb-2">
          All Courses
        </h1>
        <p className="text-gray-500 font-sans text-lg">
          Browse available courses and enroll to teach.
        </p>
      </div>

      <TeacherCourseBrowser courses={typed} />
    </main>
  );
}
