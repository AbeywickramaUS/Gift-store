'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { getBrowserSupabase } from '@/lib/supabase-browser';
import LoginForm from './LoginForm';

type AuthState =
  | { kind: 'loading' }
  | { kind: 'signed-out' }
  | { kind: 'not-admin'; email: string }
  | { kind: 'admin'; session: Session };

const SECTIONS = [
  { href: '/admin', label: 'Orders' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/sets', label: 'Gift sets' },
];

/**
 * Wraps every admin page: shows sign-in until an admin is signed in,
 * then the admin menu and the page. Access is enforced by the
 * database (RLS); this only decides what to show.
 */
export default function AdminGate({ children }: { children: (session: Session) => React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ kind: 'loading' });
  const pathname = usePathname();

  useEffect(() => {
    const supabase = getBrowserSupabase();
    let cancelled = false;

    async function resolve(session: Session | null) {
      if (!session) {
        if (!cancelled) setState({ kind: 'signed-out' });
        return;
      }
      const { data, error } = await supabase.rpc('is_admin');
      if (cancelled) return;
      if (error || data !== true) setState({ kind: 'not-admin', email: session.user.email ?? '' });
      else setState({ kind: 'admin', session });
    }

    supabase.auth.getSession().then(({ data }) => resolve(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') resolve(session);
      if (event === 'TOKEN_REFRESHED' && session) setState((s) => (s.kind === 'admin' ? { kind: 'admin', session } : s));
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = () => getBrowserSupabase().auth.signOut();

  if (state.kind === 'loading') return <div className="mx-auto h-96 max-w-6xl px-4 py-10" aria-busy="true" />;
  if (state.kind === 'signed-out') return <LoginForm />;
  if (state.kind === 'not-admin') {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-brand">No admin access</h1>
        <p className="mt-2 text-sm text-ink-2">
          {state.email} is signed in but isn&apos;t an admin. Ask the shop owner to add this account.
        </p>
        <button type="button" onClick={signOut} className="mt-6 rounded-full border border-brand/40 px-5 py-2.5 text-sm font-medium text-ink">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="border-b border-line bg-surface">
        <nav aria-label="Admin" className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
          <span className="mr-3 shrink-0 font-display text-lg text-brand">Admin</span>
          {SECTIONS.map((s) => {
            const active = s.href === '/admin' ? pathname === '/admin' : pathname.startsWith(s.href);
            return (
              <Link
                key={s.href}
                href={s.href}
                aria-current={active ? 'page' : undefined}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${active ? 'bg-brand text-on-brand' : 'text-ink-2 hover:bg-ink/8 hover:text-ink'}`}
              >
                {s.label}
              </Link>
            );
          })}
          <span className="ml-auto hidden shrink-0 pl-4 text-xs text-ink-3 sm:inline">{state.session.user.email}</span>
          <button
            type="button"
            onClick={signOut}
            className="ml-2 inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-2 hover:bg-ink/8 hover:text-ink"
          >
            <LogOut className="size-4" aria-hidden /> Sign out
          </button>
        </nav>
      </div>
      {children(state.session)}
    </>
  );
}
