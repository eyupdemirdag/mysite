import type { Metadata } from 'next';
import { pageSections } from '@/lib/data';
import { SectionRenderer } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Travel',
  description: 'Travel notes and photo galleries.',
};

export default function TravelPage() {
  const sections = pageSections.get('travel');
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
