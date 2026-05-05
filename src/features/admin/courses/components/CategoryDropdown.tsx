'use client';

import { useTransition } from 'react';
import { toggleCourseCategory } from '../actions/courseActions';

type CategoryDropdownProps = {
  courseId: string;
  allCategories: { id: string; category: string }[];
  assignedCategoryIds: string[];
};

export function CategoryDropdown({ courseId, allCategories, assignedCategoryIds }: CategoryDropdownProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (categoryId: string, isAssigned: boolean) => {
    startTransition(async () => {
      await toggleCourseCategory(courseId, categoryId, isAssigned);
    });
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-2xl bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/50 mt-8">
      <h2 className="text-3xl font-family-papernotes text-[var(--color-green)]">Manage Categories</h2>
      <p className="font-sans text-sm text-foreground/70 mb-2">Select the categories that apply to this course.</p>
      
      <div className="flex flex-wrap gap-3">
        {allCategories.map(cat => {
          const isAssigned = assignedCategoryIds.includes(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => handleToggle(cat.id, isAssigned)}
              disabled={isPending}
              className={`px-4 py-2 rounded-full font-bold font-sans text-sm transition-all shadow-sm border-2 ${
                isAssigned 
                ? 'bg-[var(--color-green)] text-white border-[var(--color-green)]' 
                : 'bg-white text-foreground/70 border-gray-200 hover:border-[var(--color-green)] hover:text-[var(--color-green)]'
              }`}
            >
              {cat.category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
