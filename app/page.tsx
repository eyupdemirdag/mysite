import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to my personal site — projects, travel, music, and blog.',
};

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
          Hi, I&apos;m here.
        </h1>
        <p className="mt-4 text-lg text-muted">
          Projects, travel notes, music, and occasional writing.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/projects"
            className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
          >
            View projects
          </Link>
          <Link
            href="/blog"
            className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium hover:bg-surface-hover"
          >
            Read blog
          </Link>
          <Link
            href="/about"
            className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium hover:bg-surface-hover"
          >
            About
          </Link>
        </div>
      </div>
    </div>
  );
}
