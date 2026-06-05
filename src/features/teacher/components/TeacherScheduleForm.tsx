"use client";

import { useTransition, useRef } from "react";
import { createTeacherSchedule, updateTeacherSchedule } from "../actions/create-teacher-schedule.action";
import { toast } from "react-toastify";

type EditableSchedule = {
  id: string;
  startTime: Date;
  endTime: Date;
  meetingUrl: string;
};

// Format a Date into a `datetime-local` value ("YYYY-MM-DDTHH:mm") using the
// browser's local timezone, so an instant stored as UTC pre-fills as wall-clock.
function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function TeacherScheduleForm({
  courseId,
  onCreated,
  schedule,
  onCancel,
}: {
  courseId: string;
  onCreated: () => void;
  schedule?: EditableSchedule;
  onCancel?: () => void;
}) {
  const isEdit = !!schedule;
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
      const result = isEdit
        ? await updateTeacherSchedule(formData)
        : await createTeacherSchedule(formData);
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
      <h3 className="font-family-papernotes text-2xl text-[#f79d1c]">
        {isEdit ? "Edit Slot" : "Create New Slot"}
      </h3>

      {isEdit && <input type="hidden" name="scheduleId" value={schedule!.id} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Start Time</label>
          <input
            className={inputClass}
            type="datetime-local"
            name="startTime"
            defaultValue={isEdit ? toLocalInputValue(new Date(schedule!.startTime)) : undefined}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>End Time</label>
          <input
            className={inputClass}
            type="datetime-local"
            name="endTime"
            defaultValue={isEdit ? toLocalInputValue(new Date(schedule!.endTime)) : undefined}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>Meeting URL (Zoom / Google Meet)</label>
        <input
          className={inputClass}
          type="url"
          name="meetingUrl"
          defaultValue={isEdit ? schedule!.meetingUrl : undefined}
          placeholder="https://meet.google.com/xxx-xxxx-xxx"
          required
        />
      </div>

      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-full transition-colors font-family-papernotes text-xl tracking-widest"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 py-3 bg-[#f79d1c] hover:bg-[#e68f12] text-white font-bold rounded-full transition-colors font-family-papernotes text-xl tracking-widest disabled:opacity-60"
        >
          {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Schedule"}
        </button>
      </div>
    </form>
  );
}
