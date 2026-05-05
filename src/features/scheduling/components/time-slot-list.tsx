"use client";

import React from "react";
import { ITimeSlotGroup, ITimeSlot } from "../interfaces/scheduling.types";

interface TimeSlotListProps {
  groups: ITimeSlotGroup[];
  selectedSlotId: string | null;
  onSelectSlot: (slot: ITimeSlot) => void;
  isLoading: boolean;
}

export function TimeSlotList({ groups, selectedSlotId, onSelectSlot, isLoading }: TimeSlotListProps) {
  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#f6e5c4] border-t-[#f79d1c] rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>Looking for available mentors...</p>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="w-full bg-[#f6e5c4]/30 rounded-2xl p-12 text-center border-2 border-dashed border-[#f6e5c4]">
        <h3 className="font-family-papernotes text-3xl text-[#e4552c] mb-2">Oh no!</h3>
        <p className="text-gray-600" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
          No mentors are available on this day. Try looking at another date!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {groups.map((group, i) => (
        <div key={i} className="flex flex-col md:flex-row gap-4 w-full">
          {/* Time Label */}
          <div className="md:w-1/3 shrink-0 flex items-start pt-2">
            <div className="bg-[#f6e5c4]/50 text-[#e4552c] font-bold py-2 px-4 rounded-xl inline-flex items-center gap-2" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {group.timeLabel}
            </div>
          </div>

          {/* Mentors List for this time */}
          <div className="md:w-2/3 flex flex-col gap-3">
            {group.slots.map((slot) => {
              const isSelected = selectedSlotId === slot.id;

              return (
                <div 
                  key={slot.id} 
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                    isSelected 
                      ? "border-[#32a569] bg-[#32a569]/5" 
                      : "border-gray-100 bg-white hover:border-[#f79d1c]/50 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ea7c9d] to-[#f79d1c] flex items-center justify-center text-white font-bold text-xl shadow-inner shrink-0">
                      {slot.mentor.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
                        {slot.mentor.name}
                      </h4>
                      <p className="text-sm text-gray-500" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
                        Available
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectSlot(slot)}
                    className={`shrink-0 px-6 py-2.5 rounded-xl font-bold transition-all ${
                      isSelected
                        ? "bg-[#32a569] text-white shadow-md cursor-default"
                        : "bg-[#f6e5c4]/60 text-[#e4552c] hover:bg-[#f79d1c] hover:text-white"
                    }`}
                    style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
                  >
                    {isSelected ? "Selected ✓" : "Select"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
