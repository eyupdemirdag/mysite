import type { TextSection as TextSectionType } from '@/lib/types';

export function TextSectionView({ section }: { section: TextSectionType }) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {section.heading && (
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">
          {section.heading}
        </h2>
      )}
      <div className="mt-3 whitespace-pre-wrap text-muted">
        {section.body || ''}
      </div>
    </section>
  );
}
