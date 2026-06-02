"use client";

import { useTransition } from "react";
import {
  updateTeacherEnrollmentStatus,
  unenrollTeacherFromCourse,
} from "../actions/manage-teacher-enrollment.action";
import { toast } from "react-toastify";

export function TeacherEnrollmentActions({
  enrollmentId,
  currentStatus,
}: {
  enrollmentId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleStatus = (status: "ACCEPTED" | "REJECTED") => {
    startTransition(async () => {
      const result = await updateTeacherEnrollmentStatus(enrollmentId, status);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleUnenroll = () => {
    startTransition(async () => {
      const result = await unenrollTeacherFromCourse(enrollmentId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  if (currentStatus === "ACCEPTED") {
    return (
      <button
        onClick={handleUnenroll}
        disabled={isPending}
        className="px-4 py-2 bg-[#e4552c]/10 hover:bg-[#e4552c] text-[#e4552c] hover:text-white rounded-full text-xs font-bold border border-[#e4552c]/30 transition-colors disabled:opacity-60 uppercase tracking-widest"
      >
        {isPending ? "Processing…" : "Unenroll"}
      </button>
    );
  }

  if (currentStatus === "REJECTED") {
    return (
      <button
        onClick={() => handleStatus("ACCEPTED")}
        disabled={isPending}
        className="px-4 py-2 bg-[#32a569]/10 hover:bg-[#32a569] text-[#32a569] hover:text-white rounded-full text-xs font-bold border border-[#32a569]/30 transition-colors disabled:opacity-60 uppercase tracking-widest"
      >
        {isPending ? "Processing…" : "Accept"}
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleStatus("ACCEPTED")}
        disabled={isPending}
        className="px-4 py-2 bg-[#32a569] hover:bg-[#28915a] text-white rounded-full text-xs font-bold transition-colors disabled:opacity-60"
      >
        Accept
      </button>
      <button
        onClick={() => handleStatus("REJECTED")}
        disabled={isPending}
        className="px-4 py-2 bg-[#e4552c] hover:bg-[#c93d1e] text-white rounded-full text-xs font-bold transition-colors disabled:opacity-60"
      >
        Reject
      </button>
    </div>
  );
}
