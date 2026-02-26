import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { pageSections, siteConfig } from '@/lib/data';
import { SectionRenderer } from '@/components/sections';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const config = siteConfig.get();
  const page = (config.customPages ?? []).find((p) => p.slug === slug);
  if (!page || page.active === false) return { title: 'Not found' };
  return { title: page.title };
}

export default async function CustomPageRoute({ params }: Props) {
  const { slug } = await params;
  const config = siteConfig.get();
  const customPages = config.customPages ?? [];
  const page = customPages.find((p) => p.slug === slug);
  if (!page || page.active === false) notFound();

  const pageId = `p-${slug}`;
  const sections = pageSections.get(pageId);

  return (
    <div className="min-h-[50vh]">
      {sections.length === 0 ? (
        <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6" />
      ) : (
        sections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))
      )}
    </div>
  );
}
