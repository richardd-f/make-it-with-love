"use client";

import React from "react";
import { ICourseContent } from "../interfaces/course.types";

export const CourseCurriculum = ({ contents }: { contents: ICourseContent[] }) => {
  return (
    <div className="w-full bg-white rounded-[2rem] p-8 sm:p-10 shadow-lg border-2 border-gray-100 mb-12 relative overflow-hidden">
      
      {/* Decorative SVG string bridging blocks */}
      <div className="absolute top-0 right-10 bottom-0 w-8 pointer-events-none z-0 hidden sm:block">
        <svg preserveAspectRatio="none" className="w-full h-full text-[#ea7c9d]/30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6">
          <path d="M16 0 Q 32 100, 0 200 T 16 400 T 0 600 T 16 800 T 16 1000" />
        </svg>
      </div>

      <h3 className="text-4xl text-gray-800 font-family-papernotes mb-8 flex items-center gap-4 relative z-10">
        <span className="w-12 h-12 bg-[#32a569] rounded-2xl flex items-center justify-center text-white text-2xl rotate-3">📚</span>
        Course Curriculum
      </h3>

      <div className="flex flex-col gap-4 relative z-10">
        {contents.map((content, idx) => (
          <div 
            key={content.id} 
            className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${content.isLocked ? 'bg-gray-50 border-gray-200' : 'bg-white border-[#32a569]/30 hover:border-[#32a569] hover:shadow-md cursor-pointer'}`}
          >
            <div className="flex items-center gap-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-family-papernotes shadow-sm ${content.isLocked ? 'bg-gray-200 text-gray-400' : 'bg-[#32a569]/10 text-[#32a569]'}`}>
                {idx + 1}
              </div>
              <div className="flex flex-col gap-1">
                <span className={`text-xl font-bold font-sans ${content.isLocked ? 'text-gray-400' : 'text-gray-800'}`}>
                  {content.title}
                </span>
                <span className="text-gray-500 font-medium text-sm flex items-center gap-2 uppercase tracking-widest font-sans">
                  🕑 {content.duration}
                </span>
              </div>
            </div>

            {/* Lock / Play Icon */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner ${content.isLocked ? 'bg-gray-200 text-gray-400' : 'bg-[#32a569] text-white hover:scale-110 transition-transform'}`}>
               {content.isLocked ? (
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm-2 7h10v6H7v-6z" clipRule="evenodd" /></svg>
               ) : (
                 <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
