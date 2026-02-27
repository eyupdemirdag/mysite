import type { Metadata } from 'next';
import { pageSections } from '@/lib/data';
import { SectionRenderer } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Projects',
  description: "A selection of projects I've worked on.",
};

export default function ProjectsPage() {
  const sections = pageSections.get('projects');
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
