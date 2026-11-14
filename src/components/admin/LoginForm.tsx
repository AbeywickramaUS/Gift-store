'use client';

import { useState, useTransition } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { getBrowserSupabase } from '@/lib/supabase-browser';

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const { error } = await getBrowserSupabase().auth.signInWithPassword({
        email: String(f.get('email') ?? '').trim(),
        password: String(f.get('password') ?? ''),
      });
      // Success is picked up by onAuthStateChange in the admin page
      if (error) setError(error.message === 'Invalid login credentials' ? 'Wrong email or password.' : error.message);
    });
  }

  const input = 'mt-1.5 block w-full rounded-xl border-2 border-line bg-surface px-4 py-3 text-base text-ink outline-none focus:border-ink';

  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="font-display text-4xl text-brand">Shop admin</h1>
      <p className="mt-2 text-ink-2">Sign in to see and update orders.</p>
      <form onSubmit={submit} className="mt-8 space-y-5">
        {error && (
          <p role="alert" className="flex items-center gap-2 rounded-xl border-2 border-danger px-4 py-3 text-sm font-semibold text-danger">
            <AlertCircle className="size-4 shrink-0" aria-hidden /> {error}
          </p>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink">Email</label>
          <input id="email" name="email" type="email" autoComplete="username" required className={input} />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-ink">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required className={input} />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 font-medium text-ground hover:bg-brand/90 disabled:opacity-70"
        >
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
