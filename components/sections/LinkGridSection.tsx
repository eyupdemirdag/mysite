import Link from 'next/link';
import type { LinkGridSection as LinkGridSectionType } from '@/lib/types';

export function LinkGridSectionView({
  section,
}: {
  section: LinkGridSectionType;
}) {
  const links = section.links?.length ? section.links : [];
  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {section.title && (
        <h2 className="mb-4 text-xl font-semibold text-[var(--foreground)]">
          {section.title}
        </h2>
      )}
      <div className="flex flex-wrap gap-3">
        {links.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className="rounded-lg border border-border bg-[var(--surface)] px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
