"use client";

import { useState, useTransition } from "react";
import { DiyKitForm } from "./DiyKitForm";
import { deleteDiyKit } from "../actions/diyKitActions";
import { ConfirmModal } from "@/src/components/ui/confirm-modal";
import { toast } from "react-toastify";
import { DiyKitModel as DiyKit } from "@/src/generated/prisma/models";

interface DiyKitListProps {
  kits: DiyKit[];
}

export function DiyKitList({ kits }: DiyKitListProps) {
  const [editingKit, setEditingKit] = useState<DiyKit | null>(null);
  const [deletingKit, setDeletingKit] = useState<DiyKit | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!deletingKit) return;
    const kitId = deletingKit.id;
    setDeletingKit(null);
    startTransition(async () => {
      const result = await deleteDiyKit(kitId);
      if ("error" in result && result.error) {
        toast.error(result.error);
      } else {
        toast.success("DIY Kit deleted successfully.");
      }
    });
  };

  return (
    <>
      <ConfirmModal
        open={!!deletingKit}
        title="Delete DIY Kit"
        message={`Are you sure you want to delete "${deletingKit?.name}"? This cannot be undone. It will fail if the kit is assigned to a course.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmColor="#e4552c"
        onConfirm={handleDelete}
        onCancel={() => setDeletingKit(null)}
      />

      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Left Column: Form */}
        <div className="w-full md:w-1/3 z-10 animate-fade-in">
          <div className="sticky top-12">
            <DiyKitForm
              kit={editingKit ?? undefined}
              key={editingKit?.id ?? "new"}
            />
            {editingKit && (
              <button
                onClick={() => setEditingKit(null)}
                className="mt-3 w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm rounded-full transition-colors"
                style={{
                  fontFamily: "var(--font-montserrat, Montserrat, sans-serif)",
                }}
              >
                Cancel Edit — Add New Instead
              </button>
            )}
          </div>
        </div>

        {/* Right Column: List */}
        <div className="w-full md:w-2/3 flex flex-col gap-6 z-10 animate-fade-in delay-200">
          <h1 className="text-5xl font-family-papernotes text-[var(--color-orange)] drop-shadow-sm mb-4">
            Manage DIY Kits
          </h1>

          <div className="flex flex-wrap gap-4">
            {kits.map((kit) => (
              <div
                key={kit.id}
                className={`group flex flex-col bg-white/60 backdrop-blur-sm p-5 rounded-2xl border-2 shadow hover:shadow-lg transition-all relative w-full sm:w-[calc(50%-8px)] ${
                  editingKit?.id === kit.id
                    ? "border-[var(--color-orange)]"
                    : "border-white/50"
                }`}
              >
                <h3 className="text-xl font-bold font-sans text-foreground">
                  {kit.name}
                </h3>
                <p className="text-sm text-foreground/70 line-clamp-2 mt-1 flex-1">
                  {kit.description || "No description"}
                </p>
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-sm font-semibold">
                  <span className="text-[var(--color-orange)]">
                    Rp {kit.price.toLocaleString("id-ID")}
                  </span>
                  <span className="text-foreground/60">Stock: {kit.stock}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() =>
                      setEditingKit(editingKit?.id === kit.id ? null : kit)
                    }
                    className="flex-1 py-2 bg-[var(--color-orange)]/10 hover:bg-[var(--color-orange)] text-[var(--color-orange)] hover:text-white rounded-xl text-xs font-bold border border-[var(--color-orange)]/30 transition-colors"
                  >
                    {editingKit?.id === kit.id ? "Editing..." : "Edit"}
                  </button>
                  <button
                    onClick={() => setDeletingKit(kit)}
                    disabled={isPending}
                    className="flex-1 py-2 bg-[var(--color-red)]/10 hover:bg-[var(--color-red)] text-[var(--color-red)] hover:text-white rounded-xl text-xs font-bold border border-[var(--color-red)]/30 transition-colors disabled:opacity-60"
                  >
                    {isPending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
            {kits.length === 0 && (
              <p className="w-full text-center p-8 text-foreground/60 italic bg-white/40 rounded-3xl border border-dashed border-gray-300">
                No DIY Kits found. Add some using the form!
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
