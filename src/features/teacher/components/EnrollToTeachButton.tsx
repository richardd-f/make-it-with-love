"use client";

import { useState, useTransition } from "react";
import { enrollToTeach, withdrawTeachEnrollment } from "../actions/teacher-enroll.action";
import { toast } from "react-toastify";
import { ConfirmModal } from "@/src/components/ui/confirm-modal";

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
  const [showConfirm, setShowConfirm] = useState(false);

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

  const handleWithdraw = () => {
    setShowConfirm(false);
    startTransition(async () => {
      const result = await withdrawTeachEnrollment(courseId);
      if (result.success) {
        setStatus(null);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const confirmTitle =
    status === "ACCEPTED" ? "Unenroll from Course" : "Cancel Request";
  const confirmMessage =
    status === "ACCEPTED"
      ? "Are you sure you want to unenroll? Your schedules and meetings for this course will be removed."
      : "Are you sure you want to cancel this enrollment request?";

  return (
    <>
      <ConfirmModal
        open={showConfirm}
        title={confirmTitle}
        message={confirmMessage}
        confirmLabel="Yes, I'm sure"
        cancelLabel="Go back"
        confirmColor={status === "ACCEPTED" ? "#e4552c" : "#f79d1c"}
        onConfirm={handleWithdraw}
        onCancel={() => setShowConfirm(false)}
      />

      {status === "ACCEPTED" && (
        <button
          onClick={() => setShowConfirm(true)}
          disabled={isPending}
          className="px-5 py-2 bg-[#e4552c]/10 hover:bg-[#e4552c] text-[#e4552c] hover:text-white rounded-full text-sm font-bold border border-[#e4552c]/30 transition-colors disabled:opacity-60"
        >
          {isPending ? "Processing..." : "Unenroll Course"}
        </button>
      )}

      {status === "PENDING" && (
        <button
          onClick={() => setShowConfirm(true)}
          disabled={isPending}
          className="px-5 py-2 bg-[#f79d1c]/10 hover:bg-[#f79d1c] text-[#f79d1c] hover:text-white rounded-full text-sm font-bold border border-[#f79d1c]/30 transition-colors disabled:opacity-60"
        >
          {isPending ? "Processing..." : "Cancel Request"}
        </button>
      )}

      {status === "REJECTED" && (
        <button
          onClick={handleEnroll}
          disabled={isPending}
          className="px-5 py-2 bg-[#ea7c9d] hover:bg-[#d86b8b] text-white rounded-full text-sm font-bold transition-colors disabled:opacity-60"
        >
          {isPending ? "Submitting..." : "Re-Apply to Teach"}
        </button>
      )}

      {status === null && (
        <button
          onClick={handleEnroll}
          disabled={isPending}
          className="px-5 py-2 bg-[#f79d1c] hover:bg-[#e68f12] text-white rounded-full text-sm font-bold transition-colors disabled:opacity-60"
        >
          {isPending ? "Submitting..." : "Enroll to Teach"}
        </button>
      )}
    </>
  );
}
