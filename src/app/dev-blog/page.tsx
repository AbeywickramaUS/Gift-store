import type { Metadata } from 'next';
import { DEV_LOG_ENTRIES } from '@/lib/devlog-data';

export const metadata: Metadata = {
  title: 'Development Blog',
  description: 'Step-by-step development log of the Gift Store — built on Next.js + Supabase + Vercel.',
};

export default function DevBlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-gradient-to-r from-pink-50 to-purple-50 dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-900">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-3 text-sm font-medium text-pink-600 dark:text-pink-400">
            🛠️ Behind the Scenes
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Development Blog
          </h1>
          <p className="mt-4 max-w-2xl text-neutral-600 dark:text-neutral-400">
            A step-by-step log of every architectural decision, feature implementation, and code
            change made while building this Gift Store on{' '}
            <strong className="text-neutral-800 dark:text-neutral-200">Next.js 16</strong> +{' '}
            <strong className="text-neutral-800 dark:text-neutral-200">Supabase</strong> +{' '}
            <strong className="text-neutral-800 dark:text-neutral-200">Vercel</strong>.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs">
            <span className="rounded-full bg-pink-100 px-3 py-1 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300">
              Next.js 16 App Router
            </span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              Supabase Free Tier
            </span>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              Vercel Deployment
            </span>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
              Tailwind CSS v4
            </span>
            <span className="rounded-full bg-green-100 px-3 py-1 text-green-700 dark:bg-green-950/50 dark:text-green-300">
              LKR (Sri Lanka)
            </span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 h-full w-px bg-neutral-200 dark:bg-neutral-800" />

          <div className="space-y-10">
            {DEV_LOG_ENTRIES.map((entry) => (
              <article
                key={entry.step}
                className="relative pl-16"
              >
                {/* Step badge */}
                <div className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full border-2 border-pink-200 bg-white text-sm font-bold text-pink-600 shadow-sm dark:border-pink-900 dark:bg-neutral-950 dark:text-pink-400">
                  #{entry.step}
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900">
                  {/* Title & Date */}
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                      {entry.title}
                    </h2>
                    <time className="shrink-0 rounded-lg bg-white px-3 py-1 text-xs text-neutral-500 shadow-sm dark:bg-neutral-800 dark:text-neutral-400">
                      {entry.date}
                    </time>
                  </div>

                  {/* Files Changed */}
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Files Created / Modified
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {entry.filesChanged.map((file) => (
                        <code
                          key={file}
                          className="rounded bg-neutral-200 px-2 py-0.5 text-xs text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"
                        >
                          {file}
                        </code>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      What Was Built
                    </p>
                    <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                      {entry.description}
                    </p>
                  </div>

                  {/* State & Challenges */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      ⚡ State & Challenges
                    </p>
                    <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-300">
                      {entry.stateAndChallenges}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-12 rounded-2xl border border-dashed border-neutral-300 p-6 text-center dark:border-neutral-700">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            🚧 More phases coming soon. This blog updates as development progresses.
          </p>
          <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
            Also available as{' '}
            <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">DEVLOG.md</code>{' '}
            in the project root.
          </p>
        </div>
      </div>
    </div>
  );
}
