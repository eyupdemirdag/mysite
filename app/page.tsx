import type { Metadata } from 'next';
import { pageSections } from '@/lib/data';
import { SectionRenderer } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Personal site — projects, travel, music, and blog.',
};

export default function HomePage() {
  const sections = pageSections.get('home');
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
