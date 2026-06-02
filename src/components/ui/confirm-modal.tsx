"use client";

import { useEffect, useRef } from "react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Yes",
  cancelLabel = "Cancel",
  confirmColor = "#e4552c",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      confirmRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={onCancel}
    >
      <div className="absolute inset-0 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-[2rem] p-8 sm:p-10 shadow-2xl border-2 border-gray-100 max-w-md w-[90%] animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-family-papernotes text-gray-800 mb-3">
          {title}
        </h3>
        <p
          className="text-gray-600 mb-8"
          style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
        >
          {message}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 rounded-full text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition-colors"
            style={{
              backgroundColor: confirmColor,
              fontFamily: "var(--font-montserrat, Montserrat, sans-serif)",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
