'use client';

import { useActionState, useEffect } from 'react';
import { loginUser } from '../actions/authActions';
import Link from 'next/link';

export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(loginUser, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6 w-full max-w-md mx-auto p-8 bg-white/40 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 relative z-10">
      <h2 className="text-4xl font-family-papernotes text-center text-[var(--color-pink)] drop-shadow-sm">Welcome Back!</h2>
      
      <div className="flex flex-col gap-2">
        <label className="font-sans font-semibold text-foreground/80 ml-2" htmlFor="email">Email</label>
        <input 
          className="w-full px-5 py-3 rounded-2xl bg-white/70 border-2 border-[var(--color-pink)]/30 focus:border-[var(--color-pink)] outline-none transition-colors shadow-inner" 
          id="email" 
          type="email" 
          name="email" 
          placeholder="your@email.com" 
          required 
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-sans font-semibold text-foreground/80 ml-2" htmlFor="password">Password</label>
        <input 
          className="w-full px-5 py-3 rounded-2xl bg-white/70 border-2 border-[var(--color-pink)]/30 focus:border-[var(--color-pink)] outline-none transition-colors shadow-inner" 
          id="password" 
          type="password" 
          name="password" 
          placeholder="******" 
          required 
          minLength={6}
        />
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 text-[var(--color-red)] bg-[var(--color-red)]/10 px-4 py-3 rounded-xl">
          <p className="text-sm font-medium">{errorMessage}</p>
        </div>
      )}

      <button 
        aria-disabled={isPending}
        type="submit" 
        className="mt-4 w-full py-4 bg-[var(--color-pink)] hover:bg-[var(--color-red)] text-white font-bold text-2xl rounded-full hover:scale-[1.02] transition-all shadow-lg font-family-papernotes tracking-widest leading-none flex items-center justify-center disabled:opacity-70 disabled:hover:scale-100"
      >
        {isPending ? 'Logging in...' : 'Login'}
      </button>

      <div className="text-center mt-4 font-sans text-sm text-foreground/70">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-[var(--color-green)] font-bold hover:underline">
          Register here
        </Link>
      </div>
    </form>
  );
}
