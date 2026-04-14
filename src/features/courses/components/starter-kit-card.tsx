"use client";

import React from "react";
import { IStarterKit } from "../interfaces/course.types";

export const StarterKitCard = ({ starterKit }: { starterKit: IStarterKit }) => {
  return (
    <div className="w-full bg-[#f6e5c4] rounded-[2rem] p-8 sm:p-10 shadow-lg relative border-4 border-[#f79d1c]/40 rotate-1 transition-transform hover:rotate-0 mb-12">
      {/* Decorative pin icon (mocking a pinned paper) */}
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#ea7c9d] rounded-full flex items-center justify-center shadow-md rotate-[-10deg]">
         <div className="w-4 h-4 bg-white rounded-full opacity-80" />
      </div>
      
      <h3 className="text-4xl text-[#e4552c] font-family-papernotes mb-6 flex items-center gap-4">
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M21 11.5v6.5C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V8.5C3 7.4 3.9 6.5 5 6.5H8.5V4C8.5 3.45 8.95 3 9.5 3H14.5C15.05 3 15.5 3.45 15.5 4V6.5H19C20.1 6.5 21 7.4 21 8.5V9.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M8.5 6.5V4h7v2.5M12 12A2 2 0 1012 16A2 2 0 1012 12Z" stroke="currentColor" strokeWidth={2} fill="none"/></svg>
        Your Starter Kit
      </h3>
      
      <p className="text-gray-700 font-normal mb-8 leading-relaxed text-lg" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
        Everything you need is included in this magical box! We send it straight to your door so the fun can begin immediately.
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {starterKit.tools.map((tool, idx) => (
          <li key={idx} className="flex items-center gap-3">
             <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#32a569] shrink-0 font-bold shadow-sm">✓</div>
             <span className="text-gray-800 font-bold text-lg" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>{tool}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/60 rounded-2xl border-2 border-white/80">
         <div className="flex items-center gap-3 w-full sm:w-auto">
            <svg className="w-8 h-8 text-[#ea7c9d]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
            <div className="flex flex-col">
               <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">Weight</span>
               <span className="text-xl text-gray-800 font-bold">{starterKit.weight}</span>
            </div>
         </div>
         <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
         <div className="flex items-center gap-3 w-full sm:w-auto">
            <svg className="w-8 h-8 text-[#32a569]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <div className="flex flex-col">
               <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">Est. Delivery</span>
               <span className="text-xl text-gray-800 font-bold">{starterKit.estimatedDelivery}</span>
            </div>
         </div>
      </div>
    </div>
  );
};
