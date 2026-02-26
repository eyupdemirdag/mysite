'use client';

import type { PageSection } from '@/lib/types';
import { PageSectionEditor } from './PageSectionEditor';

export function CustomizeHomePage({ initialSections }: { initialSections: PageSection[] }) {
  return (
    <PageSectionEditor
      pageId="home"
      pageTitle="Home"
      initialSections={initialSections}
      viewHref="/"
    />
  );
}
