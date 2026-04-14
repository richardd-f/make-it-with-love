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
  const [isSearchJumping, setIsSearchJumping] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [filters, setFilters] = useState<Partial<ICourseFilters>>({});
  const [sort, setSort] = useState("popular");

  const [isLoading, setIsLoading] = useState(true);
  const [isAppending, setIsAppending] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCourses = useCallback(async (currentFilters: Partial<ICourseFilters>, currentSort: string, currentPage: number, append: boolean = false) => {
    if (append) setIsAppending(true);
    else setIsLoading(true);

    try {
      const res = await getCourses(currentFilters, currentSort, currentPage, 20);
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

  const handleSearchClick = () => {
    // Playful flip jump
    setIsSearchJumping(true);
    setTimeout(() => setIsSearchJumping(false), 800);
  };

  // Pagination logic
  let visiblePages = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
    visiblePages.push(i);
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">

      {/* Inline styles for search flip animation and shining */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes jump-flip-playful {
          0% { transform: translateY(0) rotateY(0); }
          25% { transform: translateY(-25px) rotateY(0); }
          75% { transform: translateY(-25px) rotateY(180deg); }
          100% { transform: translateY(0) rotateY(360deg); }
        }
        .anim-jump-flip {
          animation: jump-flip-playful 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        @keyframes shine {
          0% { box-shadow: 0 0 0 4px rgba(234, 124, 157, 0.2); }
          50% { box-shadow: 0 0 20px 8px rgba(234, 124, 157, 0.6); }
          100% { box-shadow: 0 0 0 4px rgba(234, 124, 157, 0.2); }
        }
        .anim-shine {
          animation: shine 2s infinite ease-in-out;
          border-color: #ea7c9d !important;
        }
      `}} />

      {/* Sticky Top Search & Filter Bar */}
      <div className="sticky top-4 z-50 flex flex-col sm:flex-row gap-6 mb-16 pt-4 relative">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search for a fun course..."
            value={filters.query || ""}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`w-full pl-16 pr-6 py-4 sm:pl-20 sm:pr-8 sm:py-6 bg-white border border-gray-100 rounded-full focus:outline-none text-xl sm:text-2xl font-normal text-gray-800 transition-all ${isSearchFocused ? 'anim-shine' : 'shadow-xl'}`}
            style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}
          />
          <button
            onClick={handleSearchClick}
            className={`absolute left-4 top-3.5 sm:left-6 sm:top-5 w-8 h-8 sm:w-10 sm:h-10 text-[#ea7c9d] ${isSearchJumping ? 'anim-jump-flip' : ''}`}
          >
            <SearchIcon className="w-8 h-8 sm:w-10 sm:h-10 cursor-pointer" />
          </button>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center gap-2 sm:gap-4 px-6 py-4 sm:px-12 sm:py-6 rounded-full font-normal text-lg sm:text-2xl transition-all shadow-xl bg-white border border-gray-100 text-[#ea7c9d] hover:bg-[#fff5f2]`}
          style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}
        >
          <FilterIcon className="w-8 h-8" />
          {showFilters ? 'Got it!' : 'Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="relative z-40 mb-12">
          <CourseFilters
            filters={filters}
            onChange={(nf) => { setPage(1); setFilters(nf); }}
          />
        </div>
      )}

      {/* Main Content Area */}
      <main className="w-full flex flex-col mt-4 relative z-20">
        <CourseSort
          totalCount={totalCount}
          currentSort={sort}
          onSortChange={(ns) => { setPage(1); setSort(ns); }}
        />

        <div className="relative min-h-[400px]">
          {isLoading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#fffbe6]/50 backdrop-blur-sm rounded-3xl">
              <div className="w-24 h-24 border-[10px] border-[#ea7c9d] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {!isLoading && courses.length === 0 ? (
            <EmptyState onClearFilters={handleClearFilters} />
          ) : (
            <div className="flex flex-col relative z-20 gap-32 sm:gap-40 pt-16">
              {courses.map((course, i) => {
                const isLeft = i % 2 === 0;
                const nextIsLeft = (i + 1) % 2 === 0;

                const rotateClass = isLeft ? "rotate-2" : "-rotate-2";

                // SVG Physics:
                // We draw an absolute SVG linking the tail-end of this card to the top of next card.
                // It expands heavily downwards so that if this card translates up on hover, 
                // the string doesn't get cut off, revealing more tail overlapping the next card.
                // X coordinates alternate from leftmost (10%) to rightmost (90%)
                const startX = isLeft ? 10 : 90;
                const endX = nextIsLeft ? 10 : 90;

                return (
                  <div key={course.id} className="relative flex flex-col items-center w-full px-4 group">

                    {/* The String (drawn behind, extending far downwards) linked to the group hover */}
                    {i < courses.length - 1 && (
                      <div className="absolute -bottom-[250px] sm:-bottom-[300px] w-full h-[350px] sm:h-[400px] z-[0] pointer-events-none transition-transform duration-500 group-hover:-translate-y-6">
                        <svg className="w-full h-full text-[#ea7c9d] drop-shadow-sm opacity-60" preserveAspectRatio="none" viewBox="0 0 100 100">
                          <path
                            d={`M${startX},10 C${startX},50 ${endX},50 ${endX},90`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray="6 12"
                          />
                        </svg>
                      </div>
                    )}

                    {/* The Slanted Course Card */}
                    <div className={`w-full transition-transform duration-500 group-hover:-translate-y-6 ${rotateClass} z-10`}>
                      <CourseCard course={course} index={i} />
                    </div>
                  </div>
                );
              })}

              {/* Pagination with Random Left/Right Ties */}
              {totalPages > 1 && (
                <div className="mt-16 flex flex-col items-center relative z-20">
                  <div className="absolute -top-[180px] w-full h-[220px] z-[0] pointer-events-none">
                    <svg className="w-full h-full text-[#ea7c9d] drop-shadow-sm opacity-60" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path
                        d={`M${(courses.length - 1) % 2 === 0 ? 10 : 90},20 C50,50 50,80 50,100`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray="6 12"
                      />
                    </svg>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl relative z-10 w-max mx-auto">

                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-6 py-4 bg-[#f6e5c4] text-[#ea7c9d] rounded-2xl font-normal text-xl hover:bg-[#ea7c9d] hover:text-white transition-colors disabled:opacity-50"
                      style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}
                    >
                      &larr; Prev
                    </button>

                    {visiblePages[0] > 1 && (
                      <>
                        <button onClick={() => setPage(1)} className="w-16 h-16 flex items-center justify-center bg-white border border-gray-100 text-[#ea7c9d] rounded-2xl font-normal text-xl hover:bg-[#ea7c9d] hover:text-white transition-colors shadow-sm transform -rotate-2">1</button>
                        {visiblePages[0] > 2 && <span className="text-2xl font-normal text-gray-400">...</span>}
                      </>
                    )}

                    {visiblePages.map(p => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-16 h-16 flex items-center justify-center border rounded-2xl font-normal text-xl transition-all shadow-sm ${p === page ? 'bg-[#32a569] border-[#32a569] text-white scale-110 rotate-2' : 'bg-white border-gray-100 text-[#ea7c9d] hover:bg-[#ea7c9d] hover:text-white transform -rotate-1'}`}
                        style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}
                      >
                        {p}
                      </button>
                    ))}

                    {visiblePages[visiblePages.length - 1] < totalPages && (
                      <>
                        {visiblePages[visiblePages.length - 1] < totalPages - 1 && <span className="text-2xl font-normal text-gray-400">...</span>}
                        <button onClick={() => setPage(totalPages)} className="w-16 h-16 flex items-center justify-center bg-white border border-gray-100 text-[#ea7c9d] rounded-2xl font-normal text-xl hover:bg-[#ea7c9d] hover:text-white transition-colors shadow-sm transform rotate-2">{totalPages}</button>
                      </>
                    )}

                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-6 py-4 bg-[#f6e5c4] text-[#ea7c9d] rounded-2xl font-normal text-xl hover:bg-[#ea7c9d] hover:text-white transition-colors disabled:opacity-50"
                      style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}
                    >
                      Next &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
