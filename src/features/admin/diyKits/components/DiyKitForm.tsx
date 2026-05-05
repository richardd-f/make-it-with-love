'use client';

import { useActionState, useEffect } from 'react';
import { createDiyKit, updateDiyKit, deleteDiyKit } from '../actions/diyKitActions';
import { DiyKit } from '@/src/generated/prisma/client';

export function DiyKitForm({ kit }: { kit?: DiyKit }) {
  const isUpdating = !!kit;
  const action = isUpdating ? updateDiyKit.bind(null, kit.id) : createDiyKit;
  const [result, formAction, isPending] = useActionState(action as any, undefined);
  const resultMessage = result as { error?: string; success?: string } | undefined;

  return (
    <div className="flex flex-col gap-4 bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/50 w-full h-fit">
      <h3 className="text-2xl font-family-papernotes text-[var(--color-orange)]">{isUpdating ? 'Edit Kit' : 'Add New DIY Kit'}</h3>
      <form action={formAction} className="flex flex-col gap-4">
        
        <div className="flex flex-col gap-1">
          <label className="font-sans font-semibold text-foreground/80 text-sm ml-2" htmlFor={`name-${kit?.id || 'new'}`}>Item Name</label>
          <input 
            className="w-full px-4 py-2 rounded-xl bg-white/80 border-2 border-[var(--color-orange)]/30 focus:border-[var(--color-orange)] outline-none" 
            id={`name-${kit?.id || 'new'}`} name="name" type="text" required defaultValue={kit?.name} placeholder="e.g., Paint Brush"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-sans font-semibold text-foreground/80 text-sm ml-2" htmlFor={`description-${kit?.id || 'new'}`}>Description</label>
          <textarea 
            className="w-full px-4 py-2 rounded-xl bg-white/80 border-2 border-[var(--color-orange)]/30 focus:border-[var(--color-orange)] outline-none min-h-[60px]" 
            id={`description-${kit?.id || 'new'}`} name="description" defaultValue={kit?.description || ''}
          />
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="font-sans font-semibold text-foreground/80 text-sm ml-2" htmlFor={`price-${kit?.id || 'new'}`}>Price ($)</label>
            <input 
              className="w-full px-4 py-2 rounded-xl bg-white/80 border-2 border-[var(--color-orange)]/30 focus:border-[var(--color-orange)] outline-none" 
              id={`price-${kit?.id || 'new'}`} name="price" type="number" step="0.01" required min="0" defaultValue={kit?.price}
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="font-sans font-semibold text-foreground/80 text-sm ml-2" htmlFor={`stock-${kit?.id || 'new'}`}>Stock</label>
            <input 
              className="w-full px-4 py-2 rounded-xl bg-white/80 border-2 border-[var(--color-orange)]/30 focus:border-[var(--color-orange)] outline-none" 
              id={`stock-${kit?.id || 'new'}`} name="stock" type="number" required min="0" defaultValue={kit?.stock}
            />
          </div>
        </div>

        {resultMessage?.error && (
          <div className="text-[var(--color-red)] bg-[var(--color-red)]/10 px-3 py-2 rounded-lg mt-1">
            <p className="text-xs font-medium">{resultMessage.error}</p>
          </div>
        )}
        
        {resultMessage?.success && (
          <div className="text-[var(--color-green)] bg-[var(--color-green)]/10 px-3 py-2 rounded-lg mt-1">
            <p className="text-xs font-medium">{resultMessage.success}</p>
          </div>
        )}

        <button 
          aria-disabled={isPending}
          type="submit" 
          className="mt-2 py-3 bg-[var(--color-orange)] hover:bg-[var(--color-red)] text-white font-bold text-lg rounded-full transition-all shadow font-family-papernotes tracking-wide disabled:opacity-70"
        >
          {isPending ? 'Saving...' : (isUpdating ? 'Update' : 'Add Item')}
        </button>
      </form>
    </div>
  );
}
