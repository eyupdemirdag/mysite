import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/data';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const config = siteConfig.get();
  const page = (config.customPages ?? []).find((p) => p.slug === slug);
  if (!page) return { title: 'Not found' };
  return { title: page.title };
}

export default async function CustomPageRoute({ params }: Props) {
  const { slug } = await params;
  const config = siteConfig.get();
  const customPages = config.customPages ?? [];
  const page = customPages.find((p) => p.slug === slug);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
        {page.title}
      </h1>
      <p className="mt-4 text-muted">
        This is a custom page. You can add content or sections later.
      </p>
    </div>
  );
}
