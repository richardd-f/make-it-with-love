"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { IEnrolledCourse } from "../interfaces/course.types";
import { EnrolledCourseCard } from "./enrolled-course-card";
import { SearchIcon } from "@/src/components/ui/icons";

interface EnrolledCoursesCarouselProps {
  courses: IEnrolledCourse[];
}

export function EnrolledCoursesCarousel({ courses }: EnrolledCoursesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0, hasMoved: false });

  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchJumping, setIsSearchJumping] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(value.trim().toLowerCase());
    }, 300);
  };

  const filteredCourses = debouncedQuery
    ? courses.filter(
        (c) =>
          c.title.toLowerCase().includes(debouncedQuery) ||
          c.category.toLowerCase().includes(debouncedQuery) ||
          c.author.toLowerCase().includes(debouncedQuery) ||
          c.description.toLowerCase().includes(debouncedQuery)
      )
    : courses;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ left: 0, behavior: "smooth" });
      setActiveIndex(0);
    }
  }, [debouncedQuery]);

  const CARD_WIDTH = 464;

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
    const index = Math.round(el.scrollLeft / CARD_WIDTH);
    setActiveIndex(Math.min(index, filteredCourses.length - 1));
  }, [filteredCourses.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollTo = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -CARD_WIDTH : CARD_WIDTH, behavior: "smooth" });
  };

  const scrollToIndex = (index: number) => {
    scrollRef.current?.scrollTo({ left: index * CARD_WIDTH, behavior: "smooth" });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    dragState.current = { startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft, hasMoved: false };
    el.style.scrollBehavior = "auto";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.5;
    if (Math.abs(walk) > 5) dragState.current.hasMoved = true;
    el.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const endDrag = () => {
    setIsDragging(false);
    if (scrollRef.current) scrollRef.current.style.scrollBehavior = "smooth";
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (dragState.current.hasMoved) { e.preventDefault(); e.stopPropagation(); }
  };

  return (
    <div className="relative w-full flex flex-col gap-6">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes jump-flip-playful {
          0%   { transform: translateY(0) rotateY(0); }
          25%  { transform: translateY(-16px) rotateY(0); }
          75%  { transform: translateY(-16px) rotateY(180deg); }
          100% { transform: translateY(0) rotateY(360deg); }
        }
        .anim-jump-flip { animation: jump-flip-playful 0.8s cubic-bezier(0.25,1,0.5,1) forwards; }
        @keyframes shine-green {
          0%   { box-shadow: 0 0 0 4px rgba(50,165,105,0.15); }
          50%  { box-shadow: 0 0 20px 8px rgba(50,165,105,0.4); }
          100% { box-shadow: 0 0 0 4px rgba(50,165,105,0.15); }
        }
        .anim-shine-green { animation: shine-green 2s infinite ease-in-out; border-color: #32a569 !important; }
      `}} />

      {/* Search Bar */}
      <div className="px-4 sm:px-8 md:px-16">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search your courses..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-full focus:outline-none text-lg font-normal text-gray-800 transition-all ${isSearchFocused ? "anim-shine-green" : "shadow-lg"}`}
            style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
          />
          <button
            onClick={() => { setIsSearchJumping(true); setTimeout(() => setIsSearchJumping(false), 800); }}
            className={`absolute left-4 top-1/2 -translate-y-1/2 text-[#32a569] ${isSearchJumping ? "anim-jump-flip" : ""}`}
          >
            <SearchIcon className="w-6 h-6 cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        {canScrollLeft && filteredCourses.length > 0 && (
          <button onClick={() => scrollTo("left")} aria-label="Previous course"
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/90 shadow-xl flex items-center justify-center text-[#32a569] hover:bg-[#32a569] hover:text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-gray-100/50">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
        )}
        {canScrollRight && filteredCourses.length > 0 && (
          <button onClick={() => scrollTo("right")} aria-label="Next course"
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/90 shadow-xl flex items-center justify-center text-[#32a569] hover:bg-[#32a569] hover:text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-gray-100/50">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        )}
        {canScrollLeft && <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#f6e5c4] to-transparent z-20 pointer-events-none" />}
        {canScrollRight && filteredCourses.length > 0 && <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#f6e5c4] to-transparent z-20 pointer-events-none" />}

        {filteredCourses.length > 0 ? (
          /* py-24 (96px) gives enough room for shadow-2xl (~88px extent) to render without being clipped */
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto hide-scrollbar px-16 md:px-20 py-24"
            style={{ scrollSnapType: "x mandatory", cursor: isDragging ? "grabbing" : "grab", scrollBehavior: "smooth" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            onClickCapture={handleClickCapture}
          >
            {filteredCourses.map((course) => (
              <div key={course.id} style={{ scrollSnapAlign: "start" }}>
                <EnrolledCourseCard course={course} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center gap-4 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <SearchIcon className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-400 text-base" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
              No courses found for &ldquo;{query}&rdquo;
            </p>
            <button onClick={() => handleQueryChange("")}
              className="text-sm text-[#32a569] underline underline-offset-2"
              style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Dot Indicators */}
      {filteredCourses.length > 1 && (
        <div className="flex justify-center gap-2">
          {filteredCourses.map((_, index) => (
            <button key={index} onClick={() => scrollToIndex(index)}
              aria-label={`Go to course ${index + 1}`}
              className="transition-all duration-300 rounded-full"
              style={{ width: activeIndex === index ? "28px" : "10px", height: "10px", backgroundColor: activeIndex === index ? "#32a569" : "#d1d5db" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
