"use client";

import { useState, useCallback, useTransition } from "react";
import { TeacherScheduleForm } from "./TeacherScheduleForm";
import { ConfirmModal } from "@/src/components/ui/confirm-modal";
import { deleteTeacherSchedule } from "../actions/create-teacher-schedule.action";
import { toast } from "react-toastify";

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
  const [schedules] = useState(initialSchedules);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Schedule | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleSaved = useCallback(() => {
    setShowForm(false);
    setEditingId(null);
    // Reload page to get fresh data
    window.location.reload();
  }, []);

  const handleDelete = () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    startDeleteTransition(async () => {
      const result = await deleteTeacherSchedule(target.id);
      if (result.success) {
        toast.success(result.message);
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    });
  };

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
        <TeacherScheduleForm courseId={courseId} onCreated={handleSaved} />
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
            {daySchedules.map((s) =>
              editingId === s.id ? (
                <TeacherScheduleForm
                  key={s.id}
                  courseId={courseId}
                  schedule={s}
                  onCreated={handleSaved}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
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

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                        s.status === "BOOKED"
                          ? "bg-[#e4552c]/10 text-[#e4552c] border border-[#e4552c]/30"
                          : "bg-[#32a569]/10 text-[#32a569] border border-[#32a569]/30"
                      }`}
                    >
                      {s.status}
                    </span>

                    {s.status !== "BOOKED" && (
                      <button
                        onClick={() => setEditingId(s.id)}
                        className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#f79d1c]/10 text-[#f79d1c] border border-[#f79d1c]/30 hover:bg-[#f79d1c] hover:text-white transition-colors"
                      >
                        Edit
                      </button>
                    )}

                    <button
                      onClick={() => setDeleteTarget(s)}
                      disabled={isDeleting}
                      className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#e4552c]/10 text-[#e4552c] border border-[#e4552c]/30 hover:bg-[#e4552c] hover:text-white transition-colors disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        ))
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Schedule"
        message={
          deleteTarget?.status === "BOOKED"
            ? "This slot is booked by a student. Deleting it will cancel their meeting and refund their quota. Are you sure?"
            : "Are you sure you want to delete this slot?"
        }
        confirmLabel="Yes, delete"
        cancelLabel="Go back"
        confirmColor="#e4552c"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
