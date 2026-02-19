import Link from 'next/link';
import { notFound } from 'next/navigation';
import { music } from '@/lib/data';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = music.getBySlug(slug);
  if (!entry) return { title: 'Music entry not found' };
  return {
    title: entry.title,
    description: entry.description,
  };
}

function SpotifyEmbed({ url }: { url: string }) {
  const match = url.match(/spotify\.com\/(embed)?\/(album|track|playlist)\/([a-zA-Z0-9]+)/);
  if (!match) return null;
  const type = match[2];
  const id = match[3];
  const embedSrc = `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`;
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-border">
      <iframe
        title="Spotify embed"
        src={embedSrc}
        width="100%"
        height="352"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="border-0"
      />
    </div>
  );
}

export default async function MusicEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = music.getBySlug(slug);
  if (!entry || !entry.published) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/music"
        className="text-sm text-muted hover:text-[var(--foreground)]"
      >
        ← Music
      </Link>
      <div className="mt-4 flex gap-6">
        {entry.coverImage && (
          <div className="h-40 w-40 shrink-0 overflow-hidden rounded-xl border border-border">
            <img
              src={entry.coverImage}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
            {entry.title}
          </h1>
          {entry.artist && (
            <p className="mt-1 text-muted">{entry.artist}</p>
          )}
        </div>
      </div>
      <p className="mt-6 text-[var(--foreground)]/90">{entry.description}</p>
      {entry.spotifyEmbedUrl && (
        <SpotifyEmbed url={entry.spotifyEmbedUrl} />
      )}
    </div>
  );
}
