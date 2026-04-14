"use client";

import React from "react";
import { FilterIcon } from "../../../components/ui/icons";

interface CourseSortProps {
  totalCount: number;
  currentSort: string;
  onSortChange: (sort: string) => void;
}

export const CourseSort = ({ totalCount, currentSort, onSortChange }: CourseSortProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-gray-100 mb-6 gap-4">
      <div className="text-gray-500" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
        Showing <span className="font-bold text-gray-800">{totalCount}</span> courses
      </div>
      
      <div className="flex items-center gap-3">
        <FilterIcon className="w-5 h-5 text-gray-400" />
        <span className="text-sm font-semibold text-gray-700">Sort By:</span>
        <select 
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-[#f6e5c4]/20 border border-[#f6e5c4] text-gray-700 text-sm rounded-lg focus:ring-[#32a569] focus:border-[#32a569] block p-2.5 outline-none cursor-pointer"
        >
          <option value="popular">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};
