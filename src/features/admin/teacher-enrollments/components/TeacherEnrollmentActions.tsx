"use client";

import { useTransition } from "react";
import { updateTeacherEnrollmentStatus } from "../actions/manage-teacher-enrollment.action";
import { toast } from "react-toastify";

export function TeacherEnrollmentActions({
  enrollmentId,
  currentStatus,
}: {
  enrollmentId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handle = (status: "ACCEPTED" | "REJECTED") => {
    startTransition(async () => {
      const result = await updateTeacherEnrollmentStatus(enrollmentId, status);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  if (currentStatus !== "PENDING") {
    return (
      <span
        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${
          currentStatus === "ACCEPTED"
            ? "bg-[#32a569]/10 text-[#32a569] border border-[#32a569]/30"
            : "bg-[#e4552c]/10 text-[#e4552c] border border-[#e4552c]/30"
        }`}
      >
        {currentStatus}
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handle("ACCEPTED")}
        disabled={isPending}
        className="px-4 py-2 bg-[#32a569] hover:bg-[#28915a] text-white rounded-full text-xs font-bold transition-colors disabled:opacity-60"
      >
        Accept
      </button>
      <button
        onClick={() => handle("REJECTED")}
        disabled={isPending}
        className="px-4 py-2 bg-[#e4552c] hover:bg-[#c93d1e] text-white rounded-full text-xs font-bold transition-colors disabled:opacity-60"
      >
        Reject
      </button>
    </div>
  );
}
