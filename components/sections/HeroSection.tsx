import type { HeroSection as HeroSectionType } from '@/lib/types';

export function HeroSectionView({ section }: { section: HeroSectionType }) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
        {section.title || 'Welcome'}
      </h1>
      {section.subtitle && (
        <p className="mt-4 text-lg text-muted">{section.subtitle}</p>
      )}
    </section>
  );
}
