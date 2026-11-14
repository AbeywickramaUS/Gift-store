import type { Metadata } from 'next';
import { DEV_LOG_ENTRIES } from '@/lib/devlog-data';

export const metadata: Metadata = {
  title: 'How this site was built',
  description: 'Step-by-step development log of the shop: Next.js 16, Supabase and Vercel.',
};

export default function DevBlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[0.95] tracking-[-0.02em] text-brand">How this site was built</h1>
      <p className="mt-4 text-lg leading-8 text-ink-2">
        A running log of each step: what changed, why, and what went wrong along the way. Built with Next.js 16, Supabase and Vercel. The same
        log lives in <code className="rounded bg-line px-1.5 py-0.5 text-[0.9em]">DEVLOG.md</code>.
      </p>

      <nav aria-label="Steps" className="mt-8 flex flex-wrap gap-2">
        {DEV_LOG_ENTRIES.map((e) => (
          <a key={e.step} href={`#step-${e.step}`} className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-semibold text-ink-2 hover:border-ink hover:text-ink">
            Step {e.step}
          </a>
        ))}
      </nav>

      <div className="mt-12 space-y-16">
        {DEV_LOG_ENTRIES.map((entry) => (
          <article key={entry.step} id={`step-${entry.step}`} className="scroll-mt-24 border-t border-champagne pt-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="font-display text-2xl leading-tight text-brand">
                <span className="tabular-nums">{entry.step}.</span> {entry.title}
              </h2>
              <time dateTime={entry.date} className="text-sm tabular-nums text-ink-3">{entry.date}</time>
            </div>

            <p className="mt-5 text-base leading-7 text-ink-2">{entry.description}</p>

            <h3 className="mt-6 font-medium text-ink">What was hard</h3>
            <p className="mt-2 text-base leading-7 text-ink-2">{entry.stateAndChallenges}</p>

            <details className="mt-6">
              <summary className="cursor-pointer text-sm font-medium text-ink">Files changed ({entry.filesChanged.length})</summary>
              <ul className="mt-3 flex flex-wrap gap-2">
                {entry.filesChanged.map((file) => (
                  <li key={file}>
                    <code className="rounded bg-line px-2 py-0.5 text-xs text-ink-2">{file}</code>
                  </li>
                ))}
              </ul>
            </details>
          </article>
        ))}
      </div>
    </div>
  );
}
