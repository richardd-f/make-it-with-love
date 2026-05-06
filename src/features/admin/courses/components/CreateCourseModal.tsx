'use client';

import { useState } from 'react';
import { CourseForm } from './CourseForm';

export function CreateCourseModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-[var(--color-green)] hover:bg-[var(--color-pink)] text-white font-bold text-xl rounded-full shadow-md font-family-papernotes transition-colors"
      >
        + New Course
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-2 animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            {/* Reusing CourseForm. We will override its styling slightly via the parent wrapper so it looks good in a modal. */}
            <div className="w-full">
              <CourseForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
