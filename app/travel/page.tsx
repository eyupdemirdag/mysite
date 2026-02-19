import Link from 'next/link';
import { travel } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travel',
  description: 'Travel notes and photo galleries.',
};

export default function TravelPage() {
  const entries = travel.getAll();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
        Travel
      </h1>
      <p className="mt-2 text-muted">Places I’ve been and notes.</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {entries.map((entry) => (
          <Link
            key={entry.slug}
            href={`/travel/${entry.slug}`}
            className="group overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-[var(--accent)]/50 hover:bg-surface-hover"
          >
            {entry.images[0] ? (
              <div className="aspect-[4/3] overflow-hidden bg-surface-hover">
                <img
                  src={entry.images[0]}
                  alt=""
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] bg-surface-hover" />
            )}
            <div className="p-4">
              <h2 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                {entry.title}
              </h2>
              <p className="mt-0.5 text-sm text-muted">{entry.location} · {entry.date}</p>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{entry.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
