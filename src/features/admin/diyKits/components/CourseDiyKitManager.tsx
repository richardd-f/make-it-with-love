'use client';

import { useTransition } from 'react';
import { toggleDiyKitForCourse } from '../actions/diyKitActions';
import { DiyKit } from '@prisma/client';

type CourseDiyKitManagerProps = {
  courseId: string;
  allKits: DiyKit[];
  assignedKitIds: string[];
};

export function CourseDiyKitManager({ courseId, allKits, assignedKitIds }: CourseDiyKitManagerProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (kitId: string, isAssigned: boolean) => {
    startTransition(async () => {
      await toggleDiyKitForCourse(courseId, kitId, isAssigned);
    });
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-2xl bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/50 mt-8">
      <h2 className="text-3xl font-family-papernotes text-[var(--color-orange)]">Manage DIY Kits for Course</h2>
      <p className="font-sans text-sm text-foreground/70 mb-2">Select the DIY Kits to include in this course package.</p>
      
      {allKits.length === 0 ? (
        <p className="text-foreground/60 italic p-4">No DIY Kits available. Create some in the DIY Kits management page first.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {allKits.map(kit => {
            const isAssigned = assignedKitIds.includes(kit.id);
            return (
              <div key={kit.id} className={`flex flex-col p-4 rounded-2xl border-2 transition-all ${
                isAssigned 
                ? 'bg-[var(--color-orange)]/10 border-[var(--color-orange)]' 
                : 'bg-white/60 border-transparent hover:border-[var(--color-orange)]/50'
              }`}>
                <h4 className="font-bold text-lg">{kit.name}</h4>
                <p className="text-sm text-foreground/70 mb-2">${kit.price.toFixed(2)} - Stock: {kit.stock}</p>
                <button
                  onClick={() => handleToggle(kit.id, isAssigned)}
                  disabled={isPending}
                  className={`mt-auto w-full py-2 rounded-xl font-bold font-sans text-sm transition-all shadow-sm ${
                    isAssigned 
                    ? 'bg-[var(--color-red)] text-white hover:opacity-90' 
                    : 'bg-[var(--color-orange)] text-white hover:opacity-90'
                  }`}
                >
                  {isAssigned ? 'Remove' : 'Add'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
