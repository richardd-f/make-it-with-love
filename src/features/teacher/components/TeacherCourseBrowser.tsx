"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { EnrollToTeachButton } from "./EnrollToTeachButton";
import { SearchIcon, FilterIcon } from "@/src/components/ui/icons";

interface TeacherCourse {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  ageRange: string;
  thumbnailUrl: string;
  totalStudents: number;
  enrollmentStatus: "PENDING" | "ACCEPTED" | "REJECTED" | null;
}

interface TeacherCourseBrowserProps {
  courses: TeacherCourse[];
}

const CATEGORIES = ["Origami", "Painting", "Clay", "DIY Toys"];

const STATUS_ORDER: Record<string, number> = {
  ACCEPTED: 0,
  PENDING: 1,
  REJECTED: 2,
};
const NULL_STATUS_ORDER = 3;

export function TeacherCourseBrowser({ courses }: TeacherCourseBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...courses];

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((c) => selectedCategories.includes(c.category));
    }

    // Sort: ACCEPTED → PENDING → REJECTED → null
    result.sort((a, b) => {
      const orderA =
        a.enrollmentStatus !== null
          ? STATUS_ORDER[a.enrollmentStatus]
          : NULL_STATUS_ORDER;
      const orderB =
        b.enrollmentStatus !== null
          ? STATUS_ORDER[b.enrollmentStatus]
          : NULL_STATUS_ORDER;
      return orderA - orderB;
    });

    return result;
  }, [courses, searchQuery, selectedCategories]);

  const activeFilterCount = selectedCategories.length;

  return (
    <>
      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border-2 border-gray-100 rounded-full focus:outline-none focus:border-[#ea7c9d] focus:ring-4 focus:ring-[#ea7c9d]/20 text-lg text-gray-800 shadow-lg transition-all"
            style={{
              fontFamily: "var(--font-montserrat, Montserrat, sans-serif)",
            }}
          />
          <SearchIcon className="absolute left-5 top-4.5 w-6 h-6 text-[#ea7c9d]" />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg bg-white border-2 border-gray-100 text-[#ea7c9d] hover:bg-[#fff5f2]"
          style={{
            fontFamily: "var(--font-montserrat, Montserrat, sans-serif)",
          }}
        >
          <FilterIcon className="w-6 h-6" />
          {showFilters ? "Hide Filters" : "Filters"}
          {activeFilterCount > 0 && (
            <span className="ml-1 w-6 h-6 flex items-center justify-center bg-[#ea7c9d] text-white text-xs rounded-full font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="w-full bg-white rounded-[2rem] p-8 shadow-xl border-4 border-[#f6e5c4] mb-8 animate-fade-in">
          <h3 className="text-3xl font-bold mb-6 text-[#e4552c] text-center sm:text-left">
            Filters
          </h3>
          <div>
            <h4
              className="font-bold text-lg text-gray-800 mb-4"
              style={{
                fontFamily: "var(--font-montserrat, Montserrat, sans-serif)",
              }}
            >
              Activity Type
            </h4>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategories.includes(cat);
                return (
                  <label
                    key={cat}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={isActive}
                      onChange={() => handleCategoryToggle(cat)}
                    />
                    <div
                      className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-colors shadow-sm ${
                        isActive
                          ? "bg-[#32a569] border-[#32a569]"
                          : "border-gray-300 bg-gray-50 group-hover:border-[#32a569]"
                      }`}
                    >
                      {isActive && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={4}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-700 font-semibold group-hover:text-black text-lg">
                      {cat}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={() => setSelectedCategories([])}
              className="mt-6 text-sm font-bold text-[#e4552c] hover:underline"
              style={{
                fontFamily: "var(--font-montserrat, Montserrat, sans-serif)",
              }}
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="mb-4 text-gray-500 text-sm font-bold animate-fade-in" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
        Showing {filteredAndSorted.length} of {courses.length} courses
      </div>

      {/* Course list */}
      <div className="flex flex-col gap-6 animate-fade-in delay-200">
        {filteredAndSorted.map((course) => (
          <div
            key={course.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-[2rem] p-6 sm:p-8 shadow-lg border-2 border-gray-100"
          >
            <div className="flex items-center gap-6">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-20 h-20 rounded-2xl object-contain bg-[#fffbe6] mix-blend-multiply p-2 flex-shrink-0"
              />
              <div className="flex flex-col gap-1">
                <span className="px-3 py-1 bg-[#ea7c9d]/10 text-[#ea7c9d] rounded-xl text-xs uppercase tracking-widest border border-[#ea7c9d]/20 font-bold w-fit">
                  {course.category} &bull; {course.ageRange} yrs
                </span>
                <h2 className="text-2xl font-family-papernotes text-gray-800">
                  {course.title}
                </h2>
                <p className="text-sm text-gray-500 font-sans line-clamp-2">
                  {course.description}
                </p>
                <span className="text-sm text-gray-400 font-sans">
                  {course.totalStudents} students enrolled
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {course.enrollmentStatus === "ACCEPTED" && (
                <Link
                  href={`/teacher/courses/${course.id}/schedule`}
                  className="px-5 py-2 bg-[#32a569] hover:bg-[#28915a] text-white rounded-full text-sm font-bold transition-colors"
                >
                  Schedule Meeting
                </Link>
              )}
              <EnrollToTeachButton
                courseId={course.id}
                initialStatus={course.enrollmentStatus}
              />
            </div>
          </div>
        ))}

        {filteredAndSorted.length === 0 && (
          <div className="text-center py-24 text-gray-400 font-family-papernotes text-3xl">
            No courses match your filters.
          </div>
        )}
      </div>
    </>
  );
}
