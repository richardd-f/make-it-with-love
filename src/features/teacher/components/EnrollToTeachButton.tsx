"use client";

import { useState, useTransition } from "react";
import { enrollToTeach } from "../actions/teacher-enroll.action";
import { toast } from "react-toastify";

type Status = "PENDING" | "ACCEPTED" | "REJECTED" | null;

export function EnrollToTeachButton({
  courseId,
  initialStatus,
}: {
  courseId: string;
  initialStatus: Status;
}) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [isPending, startTransition] = useTransition();

  const handleEnroll = () => {
    startTransition(async () => {
      const result = await enrollToTeach(courseId);
      if (result.success) {
        setStatus("PENDING");
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  if (status === "ACCEPTED") {
    return (
      <span className="px-5 py-2 bg-[#32a569]/10 text-[#32a569] rounded-full text-sm font-bold border border-[#32a569]/30">
        ✓ Teaching
      </span>
    );
  }

  if (status === "PENDING") {
    return (
      <span className="px-5 py-2 bg-[#f79d1c]/10 text-[#f79d1c] rounded-full text-sm font-bold border border-[#f79d1c]/30">
        ⏳ Pending Approval
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <button
        onClick={handleEnroll}
        disabled={isPending}
        className="px-5 py-2 bg-[#ea7c9d] hover:bg-[#d86b8b] text-white rounded-full text-sm font-bold transition-colors disabled:opacity-60"
      >
        {isPending ? "Submitting…" : "Re-Apply to Teach"}
      </button>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={isPending}
      className="px-5 py-2 bg-[#f79d1c] hover:bg-[#e68f12] text-white rounded-full text-sm font-bold transition-colors disabled:opacity-60"
    >
      {isPending ? "Submitting…" : "Enroll to Teach"}
    </button>
  );
}
