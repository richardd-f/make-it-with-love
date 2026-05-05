"use client";

import React, { useRef, useEffect } from "react";

interface DateCarouselProps {
  dates: Date[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function DateCarousel({ dates, selectedDate, onSelectDate }: DateCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to selected date
  useEffect(() => {
    if (!scrollRef.current) return;
    
    const selectedElement = scrollRef.current.querySelector('[data-selected="true"]');
    if (selectedElement) {
      selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    // Ignore if invalid or out of bounds (handled loosely here for simplicity)
    if (!isNaN(newDate.getTime())) {
      // Find the closest date in our array to match timezones safely, or just pass it
      // For this implementation, we just pass the new Date
      onSelectDate(newDate);
    }
  };

  return (
    <div className="flex items-center gap-4 w-full mb-8">
      {/* Date Picker Button */}
      <div className="relative shrink-0">
        <label 
          htmlFor="date-picker"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#f6e5c4] text-[#e4552c] hover:bg-[#f79d1c] hover:text-white transition-colors shadow-sm cursor-pointer"
          title="Pick a specific date"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </label>
        <input 
          type="date" 
          id="date-picker"
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          onChange={handleDateChange}
          min={new Date().toISOString().split('T')[0]}
          max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
        />
      </div>

      {/* Horizontal Carousel */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-x-auto flex items-center gap-3 pb-4 pt-2 px-2 snap-x scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {dates.map((date, i) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNumber = date.getDate();
          const monthName = date.toLocaleDateString('en-US', { month: 'short' });

          return (
            <button
              key={i}
              data-selected={isSelected}
              onClick={() => onSelectDate(date)}
              className={`snap-center shrink-0 flex flex-col items-center justify-center w-20 h-24 rounded-2xl border-2 transition-all duration-300 ${
                isSelected 
                  ? "bg-[#32a569] border-[#32a569] text-white shadow-md scale-105" 
                  : "bg-white border-gray-100 text-gray-600 hover:border-[#32a569]/30 hover:shadow-sm"
              }`}
              style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
            >
              <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${isSelected ? "text-white/80" : "text-gray-400"}`}>
                {dayName}
              </span>
              <span className="text-2xl font-black leading-none mb-1">
                {dayNumber}
              </span>
              <span className={`text-xs font-medium ${isSelected ? "text-white/80" : "text-gray-500"}`}>
                {monthName}
              </span>
            </button>
          );
        })}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
