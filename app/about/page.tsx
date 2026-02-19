import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'A short bio.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
        About
      </h1>
      <div className="mt-8 space-y-6 text-[var(--foreground)]/90">
        <p>
          Replace this with your own bio. You can edit this page in{' '}
          <code className="rounded bg-surface-hover px-1.5 py-0.5 text-sm">app/about/page.tsx</code>{' '}
          or add a CMS field later.
        </p>
        <p>
          This site is built with Next.js (App Router), TypeScript, and Tailwind. Projects, travel, music, and blog are managed from the admin panel.
        </p>
      </div>
    </div>
  );
}
