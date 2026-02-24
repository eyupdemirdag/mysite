import type { PageSection } from '@/lib/types';
import { HeroSectionView } from './HeroSection';
import { LinkGridSectionView } from './LinkGridSection';
import { SpacerSectionView } from './SpacerSection';
import { TextSectionView } from './TextSection';

export function SectionRenderer({ section }: { section: PageSection }) {
  switch (section.type) {
    case 'hero':
      return <HeroSectionView section={section} />;
    case 'text':
      return <TextSectionView section={section} />;
    case 'linkGrid':
      return <LinkGridSectionView section={section} />;
    case 'spacer':
      return <SpacerSectionView section={section} />;
    default:
      return null;
  }
}
