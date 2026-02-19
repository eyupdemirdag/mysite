import Link from 'next/link';
import { notFound } from 'next/navigation';
import { travel } from '@/lib/data';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = travel.getBySlug(slug);
  if (!entry) return { title: 'Travel entry not found' };
  return {
    title: entry.title,
    description: entry.description,
  };
}

export default async function TravelEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = travel.getBySlug(slug);
  if (!entry || !entry.published) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/travel"
        className="text-sm text-muted hover:text-[var(--foreground)]"
      >
        ← Travel
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--foreground)]">
        {entry.title}
      </h1>
      <p className="mt-2 text-muted">{entry.location} · {entry.date}</p>
      <p className="mt-6 text-[var(--foreground)]/90">{entry.description}</p>
      {entry.images.length > 0 && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {entry.images.map((src, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-border">
              <img
                src={src}
                alt={`${entry.title} ${i + 1}`}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
