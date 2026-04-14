"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface CarouselProps {
  images: {
    src: string;
    alt: string;
  }[];
  autoScrollInterval?: number;
}

export function Carousel({ images, autoScrollInterval = 5 }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lastInteraction, setLastInteraction] = useState(0);

  // Triple the array to create the infinite scroll illusion
  const extendedImages = [...images, ...images, ...images];

  const scroll = useCallback((direction: "left" | "right", isManual = true) => {
    if (scrollRef.current) {
      if (isManual) setLastInteraction(Date.now());
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth / 1.5 : clientWidth / 1.5;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    // Initialize scroll position to the middle set
    if (scrollRef.current) {
      const setWidth = scrollRef.current.scrollWidth / 3;
      scrollRef.current.scrollLeft = setWidth;
    }
  }, [images]);

  useEffect(() => {
    // Auto-scroll logic
    const ms = autoScrollInterval * 1000;
    const interval = setInterval(() => {
      scroll("right", false);
    }, ms);

    return () => clearInterval(interval);
  }, [autoScrollInterval, scroll, lastInteraction]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    // Prevent layout thrashing during furious scrolling
    window.requestAnimationFrame(() => {
      if (!scrollRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const setWidth = scrollWidth / 3;

      // If we scroll into the first set (left edge buffer)
      if (scrollLeft <= setWidth * 0.1) {
        scrollRef.current.scrollLeft += setWidth;
      }
      // If we scroll into the third set (right edge buffer)
      else if (scrollLeft >= setWidth * 2.9 - clientWidth) {
        scrollRef.current.scrollLeft -= setWidth;
      }
    });
  };



  return (
    <div className="relative w-full max-w-6xl mx-auto py-8">
      {/* Left button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 backdrop-blur shadow-md text-foreground hover:bg-white transition-colors"
        aria-label="Scroll left"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Scroll container */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        onPointerDown={() => setLastInteraction(Date.now())}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {extendedImages.map((img, index) => (
          <div 
            key={index} 
            className="shrink-0 w-80 h-[400px] sm:w-96 sm:h-[450px] relative snap-center rounded-3xl overflow-hidden shadow-lg border-4 border-white/40 bg-white/20"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 320px, 384px"
            />
          </div>
        ))}
      </div>

      {/* Right button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 backdrop-blur shadow-md text-foreground hover:bg-white transition-colors"
        aria-label="Scroll right"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}
