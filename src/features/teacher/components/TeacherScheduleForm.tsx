"use client";

import { useTransition, useRef } from "react";
import { createTeacherSchedule } from "../actions/create-teacher-schedule.action";
import { toast } from "react-toastify";

export function TeacherScheduleForm({ courseId, onCreated }: { courseId: string; onCreated: () => void }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("courseId", courseId);

    // `datetime-local` yields a zone-less wall-clock string (e.g. "2026-06-10T08:30").
    // Parse it here in the browser — where the teacher's timezone is known — into a
    // real UTC instant, so the stored time is correct regardless of the server's zone.
    const startRaw = formData.get("startTime") as string;
    const endRaw = formData.get("endTime") as string;
    const start = new Date(startRaw);
    const end = new Date(endRaw);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      toast.error("Please enter a valid start and end time.");
      return;
    }
    formData.set("startTime", start.toISOString());
    formData.set("endTime", end.toISOString());

    startTransition(async () => {
      const result = await createTeacherSchedule(formData);
      if (result.success) {
        toast.success(result.message);
        formRef.current?.reset();
        onCreated();
      } else {
        toast.error(result.message);
      }
    });
  };

  const inputClass =
    "w-full px-4 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-[#f79d1c] outline-none transition-colors font-sans";
  const labelClass = "font-bold text-gray-700 text-sm ml-1";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white rounded-[2rem] p-6 shadow-lg border-2 border-[#f79d1c]/30">
      <h3 className="font-family-papernotes text-2xl text-[#f79d1c]">Create New Slot</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Start Time</label>
          <input className={inputClass} type="datetime-local" name="startTime" required />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>End Time</label>
          <input className={inputClass} type="datetime-local" name="endTime" required />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>Meeting URL (Zoom / Google Meet)</label>
        <input
          className={inputClass}
          type="url"
          name="meetingUrl"
          placeholder="https://meet.google.com/xxx-xxxx-xxx"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 bg-[#f79d1c] hover:bg-[#e68f12] text-white font-bold rounded-full transition-colors font-family-papernotes text-xl tracking-widest disabled:opacity-60"
      >
        {isPending ? "Creating…" : "Create Schedule"}
      </button>
    </form>
  );
}
