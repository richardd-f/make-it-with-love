"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ICourse, ICourseFilters } from "../interfaces/course.types";
import { getCourses } from "../actions/get-courses.action";
import { CourseFilters } from "./course-filters";
import { CourseSort } from "./course-sort";
import { CourseCard } from "./course-card";
import { EmptyState } from "./empty-state";
import { SearchIcon, FilterIcon } from "../../../components/ui/icons";

export const CoursesExplorer = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<Partial<ICourseFilters>>({});
  const [sort, setSort] = useState("popular");

  const [isLoading, setIsLoading] = useState(true);
  const [isAppending, setIsAppending] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCourses = useCallback(async (currentFilters: Partial<ICourseFilters>, currentSort: string, currentPage: number, append: boolean = false) => {
    if (append) setIsAppending(true);
    else setIsLoading(true);

    try {
      const res = await getCourses(currentFilters, currentSort, currentPage);
      if (append) {
        setCourses(prev => [...prev, ...res.data]);
      } else {
        setCourses(res.data);
      }
      setTotalCount(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsAppending(false);
    }
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setPage(1);
      fetchCourses(filters, sort, 1, false);
    }, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [filters, sort, fetchCourses]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCourses(filters, sort, nextPage, true);
    }
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
      
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-6 mb-8 mt-12 relative z-30">
        <div className="relative flex-1 group">
          <input
            type="text"
            placeholder="Search for a fun course..."
            value={filters.query || ""}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            className="w-full pl-16 pr-8 py-5 bg-white border-4 border-[#32a569]/40 rounded-full focus:outline-none focus:border-[#32a569] shadow-xl text-xl font-bold text-gray-800 transition-colors"
            style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}
          />
          <SearchIcon className="absolute left-6 top-5 w-8 h-8 text-[#32a569]" />
        </div>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-4 px-10 py-5 rounded-full font-black text-xl transition-all shadow-xl border-4 ${showFilters ? 'bg-[#e4552c] text-white border-[#e4552c] hover:bg-[#c44020]' : 'bg-white text-[#e4552c] border-[#e4552c] hover:bg-[#fff5f2]'}`}
          style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}
        >
          <FilterIcon className="w-8 h-8" />
          {showFilters ? 'Got it!' : 'Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="relative z-30">
          <CourseFilters
            filters={filters}
            onChange={(newFilters) => setFilters(newFilters)}
          />
        </div>
      )}

      {/* Main Content Area */}
      <main className="w-full flex flex-col mt-4 relative">
        <CourseSort
          totalCount={totalCount}
          currentSort={sort}
          onSortChange={(newSort) => setSort(newSort)}
        />

        <div className="relative min-h-[400px]">
          {isLoading && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#fffbe6]/50 backdrop-blur-sm rounded-3xl">
              <div className="w-20 h-20 border-8 border-[#f79d1c] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {!isLoading && courses.length === 0 ? (
            <EmptyState onClearFilters={handleClearFilters} />
          ) : (
            <div className="flex flex-col relative z-20">
              {courses.map((course, i) => (
                <div key={course.id} className="relative flex flex-col items-center">
                  <CourseCard course={course} />
                  
                  {/* Tying String connecting the cards */}
                  {i < courses.length - 1 && (
                    <div className="w-full flex justify-center h-24 sm:h-32 -my-2 relative z-0">
                      <svg className="w-40 sm:w-64 h-full text-[#ea7c9d] opacity-80" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path 
                          d={i % 2 === 0 ? "M50,0 Q10,50 50,100" : "M50,0 Q90,50 50,100"} 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="6" 
                          strokeLinecap="round" 
                          strokeDasharray="10 15" 
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}

              {page < totalPages && (
                <div className="mt-16 mb-8 flex justify-center relative z-20">
                  <button
                    onClick={handleLoadMore}
                    disabled={isAppending}
                    className="px-12 py-5 bg-[#ea7c9d] text-white font-black text-2xl rounded-full hover:bg-[#d85c80] transition-colors flex items-center gap-4 shadow-2xl hover:scale-110 transform duration-300"
                    style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}
                  >
                    {isAppending ? (
                      <span className="flex items-center gap-3">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        Fetching Magic...
                      </span>
                    ) : (
                      "🌟 Load More Fun"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
