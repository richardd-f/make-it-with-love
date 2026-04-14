"use client";

import React from "react";
import { ICourseFilters } from "../interfaces/course.types";

interface CourseFiltersProps {
  filters: Partial<ICourseFilters>;
  onChange: (newFilters: Partial<ICourseFilters>) => void;
}

const CATEGORIES = ["Origami", "Painting", "Clay", "DIY Toys"];
const AGE_RANGES = ["6-8", "9-12"];

export const CourseFilters = ({ filters, onChange }: CourseFiltersProps) => {
  const handleCategoryToggle = (cat: string) => {
    const current = filters.categories || [];
    const updated = current.includes(cat)
      ? current.filter(c => c !== cat)
      : [...current, cat];
    onChange({ ...filters, categories: updated });
  };

  const handleAgeToggle = (age: string) => {
    const current = filters.ageRanges || [];
    const updated = current.includes(age)
      ? current.filter(a => a !== age)
      : [...current, age];
    onChange({ ...filters, ageRanges: updated });
  };

  return (
    <div className="w-full bg-white rounded-[2rem] p-8 shadow-xl border-4 border-[#f6e5c4] mb-8 animate-in slide-in-from-top-4 fade-in duration-300">
      <h3 className="text-3xl font-bold mb-8 text-[#e4552c] text-center sm:text-left">Filters</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Category */}
        <div>
          <h4 className="font-bold text-lg text-gray-800 mb-4" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>Activity Type</h4>
          <div className="flex flex-col gap-4">
            {CATEGORIES.map(cat => (
              <label key={cat} className="flex items-center gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={filters.categories?.includes(cat) || false}
                  onChange={() => handleCategoryToggle(cat)}
                />
                <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-colors shadow-sm ${filters.categories?.includes(cat)
                  ? 'bg-[#32a569] border-[#32a569]'
                  : 'border-gray-300 bg-gray-50 group-hover:border-[#32a569]'
                  }`}>
                  {filters.categories?.includes(cat) && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-gray-700 font-semibold group-hover:text-black text-lg">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Age Range */}
        <div>
          <h4 className="font-bold text-lg text-gray-800 mb-4" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>Age Range</h4>
          <div className="flex flex-col gap-4">
            {AGE_RANGES.map(age => (
              <label key={age} className="flex items-center gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={filters.ageRanges?.includes(age) || false}
                  onChange={() => handleAgeToggle(age)}
                />
                <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-colors shadow-sm ${filters.ageRanges?.includes(age)
                  ? 'bg-[#f79d1c] border-[#f79d1c]'
                  : 'border-gray-300 bg-gray-50 group-hover:border-[#f79d1c]'
                  }`}>
                  {filters.ageRanges?.includes(age) && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-gray-700 font-semibold group-hover:text-black text-lg">{age} years</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="font-bold text-lg text-gray-800 mb-4" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>Price (IDR)</h4>
          <div className="flex flex-col gap-4">
            <input
              type="number"
              placeholder="Min e.g. 50000"
              value={filters.minPrice || ''}
              onChange={(e) => onChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-[#32a569]/30 focus:border-[#32a569] transition-all"
            />
            <div className="text-center text-gray-400 font-bold text-xl">to</div>
            <input
              type="number"
              placeholder="Max e.g. 300000"
              value={filters.maxPrice || ''}
              onChange={(e) => onChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-[#32a569]/30 focus:border-[#32a569] transition-all"
            />
          </div>
        </div>

        {/* Minimum Rating */}
        <div>
          <h4 className="font-bold text-lg text-gray-800 mb-4" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>Rating</h4>
          <div className="flex flex-col gap-4">
            {[4, 3, 2, 1].map(rating => (
              <label key={rating} className="flex items-center gap-4 cursor-pointer group">
                <input
                  type="radio"
                  name="rating"
                  className="hidden"
                  checked={filters.minRating === rating}
                  onChange={() => onChange({ ...filters, minRating: rating })}
                />
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-sm transition-colors ${filters.minRating === rating ? 'border-[#ea7c9d] bg-white' : 'border-gray-300 bg-gray-50 group-hover:border-[#ea7c9d]'
                  }`}>
                  {filters.minRating === rating && <div className="w-4 h-4 bg-[#ea7c9d] rounded-full" />}
                </div>
                <span className="flex items-center gap-2 text-gray-700 font-bold text-lg group-hover:text-black">
                  {rating} <svg className="w-5 h-5 text-[#f79d1c] fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> & up
                </span>
              </label>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
