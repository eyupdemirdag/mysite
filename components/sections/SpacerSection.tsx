import type { SpacerSection as SpacerSectionType } from '@/lib/types';

const heightMap = { sm: 'h-8', md: 'h-16', lg: 'h-24' };

export function SpacerSectionView({ section }: { section: SpacerSectionType }) {
  return <div className={heightMap[section.height] || 'h-8'} aria-hidden />;
}
