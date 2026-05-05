"use client";

import React from "react";
import { createPortal } from "react-dom";
import { ITimeSlot } from "../interfaces/scheduling.types";

interface BookingModalProps {
  isOpen: boolean;
  slot: ITimeSlot | null;
  onConfirm: () => void;
  onCancel: () => void;
  isBooking: boolean;
}

export function BookingModal({ isOpen, slot, onConfirm, onCancel, isBooking }: BookingModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !slot || !mounted) return null;

  const dateStr = slot.startTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const timeStr = `${slot.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${slot.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        style={{ animation: 'fadeIn 0.2s ease-out forwards' }}
        onClick={!isBooking ? onCancel : undefined}
      ></div>

      {/* Modal Content */}
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden flex flex-col border-4 border-[#f6e5c4]"
        style={{ animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
      >
        {/* Header */}
        <div className="bg-[#f6e5c4] px-6 py-4 flex items-center justify-between">
          <h2 className="font-family-papernotes text-3xl text-[#e4552c]">Confirm Meeting</h2>
          {!isBooking && (
            <button onClick={onCancel} className="text-[#e4552c] hover:bg-white/50 p-1 rounded-full transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-6" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
          <p className="text-gray-700 text-lg text-center">
            Are you sure you want to select this time with <span className="font-bold text-[#32a569]">{slot.mentor.name}</span>?
          </p>

          <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center gap-2 border border-gray-100 shadow-inner">
            <div className="flex items-center gap-2 text-gray-800 font-bold">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f79d1c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {dateStr}
            </div>
            <div className="flex items-center gap-2 text-gray-800 font-bold">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f79d1c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {timeStr}
            </div>
          </div>

          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-start gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <p className="text-sm font-medium">
              Important: You can change your time later, but you must wait 12 hours after booking to make changes. You also cannot change the time if the meeting is within 24 hours.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-4">
          <button
            onClick={onCancel}
            disabled={isBooking}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
            style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isBooking}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-[#32a569] hover:bg-[#288a56] transition-colors shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
            style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
          >
            {isBooking ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Booking...
              </>
            ) : (
              "Yes, Book It!"
            )}
          </button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />
    </div>,
    document.body
  );
}
