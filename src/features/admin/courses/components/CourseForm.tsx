'use client';

import { useActionState, useEffect } from 'react';
import { createCourse, updateCourse } from '../actions/courseActions';
import Link from 'next/link';
import { Course } from '@/src/generated/prisma/client';

export function CourseForm({ course }: { course?: Course }) {
  const isUpdating = !!course;
  const action = isUpdating ? updateCourse.bind(null, course.id) : createCourse;
  const [result, formAction, isPending] = useActionState(action as any, undefined);
  const resultMessage = result as { error?: string; success?: string } | undefined;

  return (
    <form action={formAction} className="flex flex-col gap-5 w-full max-w-2xl bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/50">
      <h2 className="text-3xl font-family-papernotes text-[var(--color-pink)]">{isUpdating ? 'Update Course' : 'Create New Course'}</h2>
      
      <div className="flex flex-col gap-1">
        <label className="font-sans font-semibold text-foreground/80 ml-2" htmlFor="name">Course Name</label>
        <input 
          className="w-full px-5 py-3 rounded-2xl bg-white/70 border-2 border-[var(--color-pink)]/30 focus:border-[var(--color-pink)] outline-none" 
          id="name" name="name" type="text" required defaultValue={course?.name}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-sans font-semibold text-foreground/80 ml-2" htmlFor="description">Description</label>
        <textarea 
          className="w-full px-5 py-3 rounded-2xl bg-white/70 border-2 border-[var(--color-pink)]/30 focus:border-[var(--color-pink)] outline-none min-h-[100px]" 
          id="description" name="description" defaultValue={course?.description || ''}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-sans font-semibold text-foreground/80 ml-2" htmlFor="minAge">Minimum Age</label>
          <input 
            className="w-full px-5 py-3 rounded-2xl bg-white/70 border-2 border-[var(--color-pink)]/30 focus:border-[var(--color-pink)] outline-none" 
            id="minAge" name="minAge" type="number" required min="0" defaultValue={course?.minAge}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-sans font-semibold text-foreground/80 ml-2" htmlFor="price">Price ($)</label>
          <input 
            className="w-full px-5 py-3 rounded-2xl bg-white/70 border-2 border-[var(--color-pink)]/30 focus:border-[var(--color-pink)] outline-none" 
            id="price" name="price" type="number" step="0.01" required min="0" defaultValue={course?.price}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-sans font-semibold text-foreground/80 ml-2" htmlFor="amountOfMeeting">Meetings</label>
          <input 
            className="w-full px-5 py-3 rounded-2xl bg-white/70 border-2 border-[var(--color-pink)]/30 focus:border-[var(--color-pink)] outline-none" 
            id="amountOfMeeting" name="amountOfMeeting" type="number" required min="1" defaultValue={course?.amountOfMeeting}
          />
        </div>
      </div>

      {resultMessage?.error && (
        <div className="text-[var(--color-red)] bg-[var(--color-red)]/10 px-4 py-3 rounded-xl">
          <p className="text-sm font-medium">{resultMessage.error}</p>
        </div>
      )}
      
      {resultMessage?.success && (
        <div className="text-[var(--color-green)] bg-[var(--color-green)]/10 px-4 py-3 rounded-xl">
          <p className="text-sm font-medium">{resultMessage.success}</p>
        </div>
      )}

      <div className="flex gap-4 mt-4">
        <button 
          aria-disabled={isPending}
          type="submit" 
          className="flex-1 py-4 bg-[var(--color-pink)] hover:bg-[var(--color-red)] text-white font-bold text-xl rounded-full transition-all shadow-md font-family-papernotes tracking-wide disabled:opacity-70"
        >
          {isPending ? 'Saving...' : 'Save Course'}
        </button>
        {isUpdating && (
          <Link href="/admin/courses" className="flex-1 py-4 bg-white hover:bg-gray-50 text-[var(--color-pink)] border-2 border-[var(--color-pink)] font-bold text-xl rounded-full transition-all shadow-md font-family-papernotes tracking-wide text-center">
            Cancel
          </Link>
        )}
      </div>
    </form>
  );
}
