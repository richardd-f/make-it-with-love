"use client";

import { useState, useCallback } from "react";
import { TeacherScheduleForm } from "./TeacherScheduleForm";

type Schedule = {
  id: string;
  startTime: Date;
  endTime: Date;
  meetingUrl: string;
  status: string;
};

export function TeacherScheduleBoard({
  courseId,
  courseTitle,
  initialSchedules,
}: {
  courseId: string;
  courseTitle: string;
  initialSchedules: Schedule[];
}) {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [showForm, setShowForm] = useState(false);

  const handleCreated = useCallback(() => {
    setShowForm(false);
    // Reload page to get fresh data
    window.location.reload();
  }, []);

  const groupByDate = (items: Schedule[]) => {
    const map = new Map<string, Schedule[]>();
    for (const s of items) {
      const date = new Date(s.startTime).toLocaleDateString("id-ID", { dateStyle: "full" });
      if (!map.has(date)) map.set(date, []);
      map.get(date)!.push(s);
    }
    return map;
  };

  const grouped = groupByDate(schedules);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-family-papernotes text-gray-700">
          Your Schedules for <span className="text-[#f79d1c]">{courseTitle}</span>
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-[#f79d1c] hover:bg-[#e68f12] text-white font-bold rounded-full transition-colors font-family-papernotes text-lg tracking-widest"
        >
          {showForm ? "Cancel" : "+ Add Slot"}
        </button>
      </div>

      {showForm && (
        <TeacherScheduleForm courseId={courseId} onCreated={handleCreated} />
      )}

      {grouped.size === 0 ? (
        <div className="text-center py-16 text-gray-400 font-family-papernotes text-2xl">
          No schedules yet. Add your first slot!
        </div>
      ) : (
        Array.from(grouped.entries()).map(([date, daySchedules]) => (
          <div key={date} className="flex flex-col gap-3">
            <h3 className="font-bold text-gray-700 text-lg font-family-papernotes border-b-2 border-gray-100 pb-2 capitalize">
              {date}
            </h3>
            {daySchedules.map((s) => (
              <div
                key={s.id}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 rounded-2xl border-2 ${
                  s.status === "BOOKED"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-white border-[#32a569]/30 hover:border-[#32a569]"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-gray-800 font-sans text-lg">
                    {new Date(s.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {" – "}
                    {new Date(s.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <a
                    href={s.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#32a569] hover:underline font-sans truncate max-w-xs"
                  >
                    {s.meetingUrl}
                  </a>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                    s.status === "BOOKED"
                      ? "bg-[#e4552c]/10 text-[#e4552c] border border-[#e4552c]/30"
                      : "bg-[#32a569]/10 text-[#32a569] border border-[#32a569]/30"
                  }`}
                >
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
