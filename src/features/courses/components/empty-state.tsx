import React from "react";
import { SearchIcon } from "../../../components/ui/icons";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export const EmptyState = ({ onClearFilters }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#f6e5c4]/10 rounded-3xl border-2 border-dashed border-[#f6e5c4]">
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
        <SearchIcon className="w-12 h-12 text-[#ea7c9d] opacity-50" />
      </div>
      <h3 className="text-3xl font-bold font-family-papernotes text-[#e4552c] mb-3">No Courses Found</h3>
      <p className="text-gray-500 mb-8 max-w-md" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
        Oops, we couldn&apos;t find any courses matching your filters. Try tweaking your search or filtering options.
      </p>
      <button 
        onClick={onClearFilters}
        className="px-8 py-3 bg-[#32a569] text-white font-bold rounded-full hover:bg-[#288a56] transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        Clear All Filters
      </button>
    </div>
  );
};
