"use client";

import React from "react";

interface CalendarMonthProps {
  /** Any date within the month to display. */
  viewDate: Date;
  selectedDate: Date;
  /** Local date keys ("YYYY-MM-DD") that have at least one available slot. */
  daysWithSlots: Set<string>;
  onSelectDate: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  /** Disable navigating earlier than the current month. */
  canGoPrev: boolean;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function localDateKey(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function CalendarMonth({
  viewDate,
  selectedDate,
  daysWithSlots,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  canGoPrev,
}: CalendarMonthProps) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Leading blanks for alignment, then each day of the month.
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const monthLabel = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const selectedKey = localDateKey(selectedDate);

  const navBtn =
    "flex items-center justify-center w-10 h-10 rounded-full bg-[#f6e5c4] text-[#e4552c] hover:bg-[#f79d1c] hover:text-white transition-colors shadow-sm disabled:opacity-40 disabled:hover:bg-[#f6e5c4] disabled:hover:text-[#e4552c] disabled:cursor-not-allowed";

  return (
    <div className="w-full" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={onPrevMonth} disabled={!canGoPrev} className={navBtn} aria-label="Previous month">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h3 className="font-family-papernotes text-2xl text-[#e4552c]">{monthLabel}</h3>
        <button type="button" onClick={onNextMonth} className={navBtn} aria-label="Next month">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Weekday labels */}
      <div className="flex w-full mb-2">
        {WEEKDAYS.map((w) => (
          <div key={w} className="basis-[14.2857%] shrink-0 text-center text-xs font-bold uppercase tracking-wider text-gray-400">
            {w}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="flex flex-wrap w-full">
        {cells.map((date, i) => {
          if (!date) {
            return <div key={`blank-${i}`} className="basis-[14.2857%] shrink-0 p-1" />;
          }

          const key = localDateKey(date);
          const isPast = date < today;
          const isSelected = key === selectedKey;
          const hasSlots = daysWithSlots.has(key);
          const isToday = key === localDateKey(today);

          let cls =
            "w-full aspect-square rounded-2xl flex flex-col items-center justify-center text-sm font-bold transition-all border-2 ";
          if (isSelected) {
            cls += "bg-[#32a569] border-[#32a569] text-white shadow-md scale-105";
          } else if (isPast) {
            cls += "bg-gray-50 border-transparent text-gray-300 cursor-not-allowed";
          } else if (hasSlots) {
            cls += "bg-[#f79d1c]/20 border-[#f79d1c]/40 text-[#e4552c] hover:bg-[#f79d1c]/40";
          } else {
            cls += "bg-white border-gray-100 text-gray-600 hover:border-[#32a569]/30";
          }

          return (
            <div key={key} className="basis-[14.2857%] shrink-0 p-1">
              <button
                type="button"
                disabled={isPast}
                onClick={() => onSelectDate(date)}
                className={cls}
              >
                <span>{date.getDate()}</span>
                {hasSlots && !isSelected && (
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#f79d1c]" />
                )}
                {isToday && !isSelected && (
                  <span className="text-[9px] font-medium uppercase tracking-wider text-gray-400">today</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#f79d1c]/40 border border-[#f79d1c]/60" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#32a569]" /> Selected
        </span>
      </div>
    </div>
  );
}
