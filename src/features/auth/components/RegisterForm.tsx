'use client';

import { useActionState, useEffect } from 'react';
import { registerUser } from '../actions/authActions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function RegisterForm() {
  const [resultMessage, formAction, isPending] = useActionState(registerUser, undefined);
  const router = useRouter();

  useEffect(() => {
    if (resultMessage === 'SUCCESS') {
      router.push('/login');
    }
  }, [resultMessage, router]);

  return (
    <form action={formAction} className="flex flex-col gap-5 w-full max-w-md mx-auto p-8 bg-white/40 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 relative z-10">
      <h2 className="text-4xl font-family-papernotes text-center text-[var(--color-green)] drop-shadow-sm">Join the Fun!</h2>
      
      <div className="flex flex-col gap-1">
        <label className="font-sans font-semibold text-foreground/80 ml-2" htmlFor="name">Name</label>
        <input 
          className="w-full px-5 py-3 rounded-2xl bg-white/70 border-2 border-[var(--color-green)]/30 focus:border-[var(--color-green)] outline-none transition-colors shadow-inner" 
          id="name" 
          type="text" 
          name="name" 
          placeholder="Your Name" 
          required 
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-sans font-semibold text-foreground/80 ml-2" htmlFor="email">Email</label>
        <input 
          className="w-full px-5 py-3 rounded-2xl bg-white/70 border-2 border-[var(--color-green)]/30 focus:border-[var(--color-green)] outline-none transition-colors shadow-inner" 
          id="email" 
          type="email" 
          name="email" 
          placeholder="your@email.com" 
          required 
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-sans font-semibold text-foreground/80 ml-2" htmlFor="password">Password</label>
        <input 
          className="w-full px-5 py-3 rounded-2xl bg-white/70 border-2 border-[var(--color-green)]/30 focus:border-[var(--color-green)] outline-none transition-colors shadow-inner" 
          id="password" 
          type="password" 
          name="password" 
          placeholder="******" 
          required 
          minLength={6}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-sans font-semibold text-foreground/80 ml-2" htmlFor="confirmPassword">Confirm Password</label>
        <input 
          className="w-full px-5 py-3 rounded-2xl bg-white/70 border-2 border-[var(--color-green)]/30 focus:border-[var(--color-green)] outline-none transition-colors shadow-inner" 
          id="confirmPassword" 
          type="password" 
          name="confirmPassword" 
          placeholder="******" 
          required 
          minLength={6}
        />
      </div>

      {resultMessage && resultMessage !== 'SUCCESS' && (
        <div className="flex items-center gap-2 text-[var(--color-red)] bg-[var(--color-red)]/10 px-4 py-3 rounded-xl">
          <p className="text-sm font-medium">{resultMessage}</p>
        </div>
      )}

      <button 
        aria-disabled={isPending}
        type="submit" 
        className="mt-2 w-full py-4 bg-[var(--color-green)] hover:bg-[var(--color-red)] text-white font-bold text-2xl rounded-full hover:scale-[1.02] transition-all shadow-lg font-family-papernotes tracking-widest leading-none flex items-center justify-center disabled:opacity-70 disabled:hover:scale-100"
      >
        {isPending ? 'Registering...' : 'Sign Up'}
      </button>

      <div className="text-center mt-2 font-sans text-sm text-foreground/70">
        Already have an account?{' '}
        <Link href="/login" className="text-[var(--color-pink)] font-bold hover:underline">
          Login here
        </Link>
      </div>
    </form>
  );
}
