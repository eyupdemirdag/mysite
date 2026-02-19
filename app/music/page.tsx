import Link from 'next/link';
import { music } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Music',
  description: 'Albums and playlists I like.',
};

export default function MusicPage() {
  const entries = music.getAll();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
        Music
      </h1>
      <p className="mt-2 text-muted">Albums and playlists.</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <Link
            key={entry.slug}
            href={`/music/${entry.slug}`}
            className="group overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-[var(--accent)]/50 hover:bg-surface-hover"
          >
            {entry.coverImage ? (
              <div className="aspect-square overflow-hidden bg-surface-hover">
                <img
                  src={entry.coverImage}
                  alt=""
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="aspect-square bg-surface-hover flex items-center justify-center text-muted text-4xl">
                ♪
              </div>
            )}
            <div className="p-4">
              <h2 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                {entry.title}
              </h2>
              {entry.artist && (
                <p className="mt-0.5 text-sm text-muted">{entry.artist}</p>
              )}
              <p className="mt-2 line-clamp-2 text-sm text-muted">{entry.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
