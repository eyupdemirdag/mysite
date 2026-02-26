'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GripVertical, Plus, Settings, Github, Instagram, Linkedin, Link2, Mail, Music } from 'lucide-react';
import type { SiteConfig, FooterSocialType, FooterSocialLink, SizeOption, HeaderAlignOption } from '@/lib/types';

const iconMap: Record<FooterSocialType | 'custom', typeof Mail> = { mail: Mail, linkedin: Linkedin, github: Github, instagram: Instagram, spotify: Music, custom: Link2 };
const labelMap: Record<FooterSocialType, string> = { mail: 'Email', linkedin: 'LinkedIn', github: 'GitHub', instagram: 'Instagram', spotify: 'Spotify' };
function getLinkLabel(link: FooterSocialLink): string {
  return link.type === 'custom' ? link.label : labelMap[link.type];
}

const nameSizeClass: Record<SizeOption, string> = { sm: 'text-xs', md: 'text-sm sm:text-base', lg: 'text-base sm:text-lg' };
const navSizeClass: Record<SizeOption, string> = { sm: 'text-xs', md: 'text-xs sm:text-sm', lg: 'text-sm sm:text-base' };
const iconSizeClass: Record<SizeOption, string> = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' };
const copyrightSizeClass: Record<SizeOption, string> = { sm: 'text-[10px]', md: 'text-xs', lg: 'text-sm' };
const alignJustifyClass: Record<HeaderAlignOption, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

function FooterCustomIcon({ url, sizeClass }: { url: string; sizeClass: string }) {
  return (
    <span
      className={`inline-block ${sizeClass}`}
      style={{
        maskImage: `url(${url})`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: `url(${url})`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        backgroundColor: 'currentColor',
      }}
    />
  );
}

export type EditTarget =
  | { type: 'header-name' }
  | { type: 'header-settings' }
  | { type: 'header-logo' }
  | { type: 'nav'; index: number }
  | { type: 'nav-new' }
  | { type: 'footer-copyright' }
  | { type: 'footer-settings' }
  | { type: 'footer-social'; index: number }
  | { type: 'footer-social-new' }
  | null;

export function EditableSitePreview({
  config,
  onEdit,
  onReorderNav,
  onReorderFooter,
  onReorderBrand,
}: {
  config: SiteConfig;
  onEdit: (target: NonNullable<EditTarget>) => void;
  onReorderNav?: (newOrder: { href: string; label: string }[]) => void;
  onReorderFooter?: (newOrder: FooterSocialLink[]) => void;
  onReorderBrand?: (order: 'logo-name' | 'name-logo') => void;
}) {
  const { header, footer } = config;
  const currentYear = new Date().getFullYear();
  const [dragNavIndex, setDragNavIndex] = useState<number | null>(null);
  const [dragFooterIndex, setDragFooterIndex] = useState<number | null>(null);
  const [overNavIndex, setOverNavIndex] = useState<number | null>(null);
  const [overFooterIndex, setOverFooterIndex] = useState<number | null>(null);
  const [dragBrandIndex, setDragBrandIndex] = useState<number | null>(null);
  const [overBrandIndex, setOverBrandIndex] = useState<number | null>(null);

  const nameSize = header.nameSize ?? 'md';
  const navSize = header.navSize ?? 'md';
  const iconSize = footer.iconSize ?? 'md';
  const copyrightSize = footer.copyrightSize ?? 'md';
  const socialLinks = footer.socialLinks ?? [];
  const footerContentOrder = footer.footerContentOrder ?? 'social-copyright';
  const socialAlign = footer.socialAlign ?? 'center';
  const copyrightAlign = footer.copyrightAlign ?? 'center';
  const isOppositeSidesFooter =
    (socialAlign === 'left' && copyrightAlign === 'right') || (socialAlign === 'right' && copyrightAlign === 'left');
  const socialJustify = alignJustifyClass[socialAlign];
  const copyrightJustify = alignJustifyClass[copyrightAlign];
  const hasLogo = Boolean(header.logoUrl?.trim());
  const hasName = Boolean(header.name?.trim());
  const showSeparator = hasLogo && hasName;
  const headerAlign = header.headerAlign ?? 'center';
  const navAlign = header.navAlign ?? 'center';
  const brandOrder = header.brandOrder ?? 'logo-name';
  const isOppositeSides =
    (headerAlign === 'left' && navAlign === 'right') || (headerAlign === 'right' && navAlign === 'left');
  const headerJustify = alignJustifyClass[headerAlign];
  const navJustify = alignJustifyClass[navAlign];

  const handleNavDragStart = (e: React.DragEvent, index: number) => {
    setDragNavIndex(index);
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleNavDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setOverNavIndex(index);
  };
  const handleNavDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    setOverNavIndex(null);
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (isNaN(fromIndex) || fromIndex === toIndex || !onReorderNav) {
      setDragNavIndex(null);
      return;
    }
    const items = [...header.navItems];
    const [removed] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, removed);
    onReorderNav(items);
    setDragNavIndex(null);
  };
  const clearNavDrag = () => {
    setDragNavIndex(null);
    setOverNavIndex(null);
  };

  const handleFooterDragStart = (e: React.DragEvent, index: number) => {
    setDragFooterIndex(index);
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleFooterDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setOverFooterIndex(index);
  };
  const handleFooterDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    setOverFooterIndex(null);
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (isNaN(fromIndex) || fromIndex === toIndex || !onReorderFooter) {
      setDragFooterIndex(null);
      return;
    }
    const links = [...socialLinks];
    const [removed] = links.splice(fromIndex, 1);
    links.splice(toIndex, 0, removed);
    onReorderFooter(links);
    setDragFooterIndex(null);
  };
  const clearFooterDrag = () => {
    setDragFooterIndex(null);
    setOverFooterIndex(null);
  };

  const handleBrandDragStart = (e: React.DragEvent, index: number) => {
    setDragBrandIndex(index);
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleBrandDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setOverBrandIndex(index);
  };
  const handleBrandDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    setOverBrandIndex(null);
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (isNaN(fromIndex) || fromIndex === toIndex || !onReorderBrand) {
      setDragBrandIndex(null);
      return;
    }
    const newOrder = brandOrder === 'logo-name' ? 'name-logo' : 'logo-name';
    onReorderBrand(newOrder);
    setDragBrandIndex(null);
  };
  const clearBrandDrag = () => {
    setDragBrandIndex(null);
    setOverBrandIndex(null);
  };

  const logoButton = (
    <button type="button" onClick={() => onEdit({ type: 'header-logo' })} className="edit-zone-hover relative rounded-lg p-1 -m-1 min-h-[3.5rem] sm:min-h-[5rem] flex items-center justify-center border border-dashed border-border/50" title={hasLogo ? 'Edit logo' : 'Add logo'} aria-label={hasLogo ? 'Edit logo' : 'Add logo'}>
      {hasLogo ? <Image src={header.logoUrl!} alt="" width={280} height={84} className="h-14 w-auto object-contain dark:invert-0 sm:h-20" /> : <span className="text-xs text-muted">Logo</span>}
    </button>
  );
  const nameButton = (
    <button type="button" onClick={() => onEdit({ type: 'header-name' })} className={`edit-zone-hover font-semibold tracking-[0.2em] text-[var(--foreground)] uppercase px-2 py-1 -mx-2 -my-1 min-w-[4rem] ${nameSizeClass[nameSize]} ${!hasName ? 'text-muted italic' : ''}`}>{hasName ? header.name : 'Name'}</button>
  );
  const firstBrandBlock = brandOrder === 'name-logo' ? nameButton : logoButton;
  const secondBrandBlock = brandOrder === 'name-logo' ? logoButton : nameButton;
  const brandBlockWithDrag = showSeparator && onReorderBrand ? (
    <div className="flex items-center gap-2 sm:gap-4">
      <div
        draggable
        onDragStart={(e) => handleBrandDragStart(e, 0)}
        onDragOver={(e) => handleBrandDragOver(e, 0)}
        onDrop={(e) => handleBrandDrop(e, 0)}
        onDragEnd={clearBrandDrag}
        className={`drag-item flex items-center gap-1 rounded-lg border border-transparent ${dragBrandIndex === 0 ? 'drag-source' : ''} ${overBrandIndex === 0 && dragBrandIndex !== null ? 'drag-drop-target' : ''}`}
      >
        <span className="cursor-grab touch-none text-muted opacity-70 hover:opacity-100" title="Drag to swap with name"><GripVertical className="h-3.5 w-3.5" /></span>
        {firstBrandBlock}
      </div>
      <span className="h-8 w-px shrink-0 rounded-full bg-border sm:h-10" aria-hidden />
      <div
        draggable
        onDragStart={(e) => handleBrandDragStart(e, 1)}
        onDragOver={(e) => handleBrandDragOver(e, 1)}
        onDrop={(e) => handleBrandDrop(e, 1)}
        onDragEnd={clearBrandDrag}
        className={`drag-item flex items-center gap-1 rounded-lg border border-transparent ${dragBrandIndex === 1 ? 'drag-source' : ''} ${overBrandIndex === 1 && dragBrandIndex !== null ? 'drag-drop-target' : ''}`}
      >
        <span className="cursor-grab touch-none text-muted opacity-70 hover:opacity-100" title="Drag to swap with logo"><GripVertical className="h-3.5 w-3.5" /></span>
        {secondBrandBlock}
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-2 sm:gap-4">
      {logoButton}
      {showSeparator && <span className="h-8 w-px shrink-0 rounded-full bg-border sm:h-10" aria-hidden />}
      {nameButton}
    </div>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[var(--background)] shadow-2xl">
      {/* Header */}
      <header className="border-b border-border bg-[var(--surface)]/90">
        <div
          className={`mx-auto max-w-5xl px-4 py-3 sm:px-6 sm:py-4 ${isOppositeSides ? 'flex flex-row flex-nowrap items-center justify-between gap-4 sm:gap-6' : 'flex flex-col gap-2 sm:gap-3'}`}
        >
          {isOppositeSides ? (
            <>
              {headerAlign === 'left' ? (
                <div className={`flex shrink-0 items-center gap-2 sm:gap-4 ${headerJustify}`}>
                  {brandBlockWithDrag}
                  <button type="button" onClick={() => onEdit({ type: 'header-settings' })} className="edit-zone-hover p-1.5 rounded text-muted hover:text-[var(--foreground)]" title="Header settings" aria-label="Header settings"><Settings className="h-4 w-4" /></button>
                </div>
              ) : (
                <nav className="w-auto py-1">
                  <div className={`flex min-w-0 flex-nowrap items-center gap-2 sm:flex-wrap sm:gap-6 ${navJustify}`}>
                    {header.navItems.map((item, index) => (
                      <div key={`${item.href}-${index}`} draggable={!!onReorderNav} onDragStart={(e) => onReorderNav && handleNavDragStart(e, index)} onDragOver={(e) => onReorderNav && handleNavDragOver(e, index)} onDrop={(e) => onReorderNav && handleNavDrop(e, index)} onDragEnd={clearNavDrag} className={`drag-item flex items-center gap-1 rounded-lg border border-transparent ${dragNavIndex === index ? 'drag-source' : ''} ${overNavIndex === index && dragNavIndex !== null ? 'drag-drop-target' : ''}`}>
                        {onReorderNav && <span className="cursor-grab touch-none text-muted opacity-70 hover:opacity-100" title="Drag to reorder"><GripVertical className="h-3.5 w-3.5" /></span>}
                        <button type="button" onClick={() => onEdit({ type: 'nav', index })} className={`edit-zone-hover relative shrink-0 rounded-lg px-3 py-2 font-medium tracking-wide text-muted sm:min-w-[4.5rem] sm:px-4 sm:py-2.5 ${navSizeClass[navSize]}`}>{item.label || 'Link'}</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => onEdit({ type: 'nav-new' })} className="edit-zone-hover flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-2 text-xs font-medium text-muted sm:px-4 sm:py-2.5 sm:text-sm" title="Add new menu link"><Plus className="h-3.5 w-3.5" /> Add link</button>
                  </div>
                </nav>
              )}
              {headerAlign === 'left' ? (
                <nav className="w-auto py-1">
                  <div className={`flex min-w-0 flex-nowrap items-center gap-2 sm:flex-wrap sm:gap-6 ${navJustify}`}>
                    {header.navItems.map((item, index) => (
                      <div key={`${item.href}-${index}`} draggable={!!onReorderNav} onDragStart={(e) => onReorderNav && handleNavDragStart(e, index)} onDragOver={(e) => onReorderNav && handleNavDragOver(e, index)} onDrop={(e) => onReorderNav && handleNavDrop(e, index)} onDragEnd={clearNavDrag} className={`drag-item flex items-center gap-1 rounded-lg border border-transparent ${dragNavIndex === index ? 'drag-source' : ''} ${overNavIndex === index && dragNavIndex !== null ? 'drag-drop-target' : ''}`}>
                        {onReorderNav && <span className="cursor-grab touch-none text-muted opacity-70 hover:opacity-100" title="Drag to reorder"><GripVertical className="h-3.5 w-3.5" /></span>}
                        <button type="button" onClick={() => onEdit({ type: 'nav', index })} className={`edit-zone-hover relative shrink-0 rounded-lg px-3 py-2 font-medium tracking-wide text-muted sm:min-w-[4.5rem] sm:px-4 sm:py-2.5 ${navSizeClass[navSize]}`}>{item.label || 'Link'}</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => onEdit({ type: 'nav-new' })} className="edit-zone-hover flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-2 text-xs font-medium text-muted sm:px-4 sm:py-2.5 sm:text-sm" title="Add new menu link"><Plus className="h-3.5 w-3.5" /> Add link</button>
                  </div>
                </nav>
              ) : (
                <div className={`flex shrink-0 items-center gap-2 sm:gap-4 ${headerJustify}`}>
                  {brandBlockWithDrag}
                  <button type="button" onClick={() => onEdit({ type: 'header-settings' })} className="edit-zone-hover p-1.5 rounded text-muted hover:text-[var(--foreground)]" title="Header settings" aria-label="Header settings"><Settings className="h-4 w-4" /></button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className={`flex w-full items-center gap-2 sm:gap-4 ${headerJustify}`}>
                {brandBlockWithDrag}
                <button type="button" onClick={() => onEdit({ type: 'header-settings' })} className="edit-zone-hover p-1.5 rounded text-muted hover:text-[var(--foreground)]" title="Header settings" aria-label="Header settings"><Settings className="h-4 w-4" /></button>
              </div>
              <nav className="w-full py-1">
                <div className={`flex min-w-0 flex-nowrap items-center gap-2 sm:flex-wrap sm:gap-6 ${navJustify}`}>
                  {header.navItems.map((item, index) => (
                    <div key={`${item.href}-${index}`} draggable={!!onReorderNav} onDragStart={(e) => onReorderNav && handleNavDragStart(e, index)} onDragOver={(e) => onReorderNav && handleNavDragOver(e, index)} onDrop={(e) => onReorderNav && handleNavDrop(e, index)} onDragEnd={clearNavDrag} className={`drag-item flex items-center gap-1 rounded-lg border border-transparent ${dragNavIndex === index ? 'drag-source' : ''} ${overNavIndex === index && dragNavIndex !== null ? 'drag-drop-target' : ''}`}>
                      {onReorderNav && <span className="cursor-grab touch-none text-muted opacity-70 hover:opacity-100" title="Drag to reorder"><GripVertical className="h-3.5 w-3.5" /></span>}
                      <button type="button" onClick={() => onEdit({ type: 'nav', index })} className={`edit-zone-hover relative shrink-0 rounded-lg px-3 py-2 font-medium tracking-wide text-muted sm:min-w-[4.5rem] sm:px-4 sm:py-2.5 ${navSizeClass[navSize]}`}>{item.label || 'Link'}</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => onEdit({ type: 'nav-new' })} className="edit-zone-hover flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-2 text-xs font-medium text-muted sm:px-4 sm:py-2.5 sm:text-sm" title="Add new menu link"><Plus className="h-3.5 w-3.5" /> Add link</button>
                </div>
              </nav>
            </>
          )}
        </div>
      </header>

      <div className="flex h-24 items-center justify-center border-b border-border bg-[var(--surface)]/50">
        <span className="text-xs text-muted">Site content</span>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          {isOppositeSidesFooter ? (
            <div className="flex flex-row flex-nowrap items-center justify-between gap-6">
              {socialAlign === 'left' ? (
                <>
                  <div className={`flex flex-wrap items-center gap-6 ${socialJustify}`}>
                    {socialLinks.map((link, index) => {
                      const type = link.type;
                      const Icon = iconMap[type];
                      const label = getLinkLabel(link);
                      return (
                        <div key={`${type}-${index}`} draggable={!!onReorderFooter} onDragStart={(e) => { e.stopPropagation(); onReorderFooter && handleFooterDragStart(e, index); }} onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); onReorderFooter && handleFooterDragOver(e, index); }} onDrop={(e) => { e.preventDefault(); e.stopPropagation(); onReorderFooter && handleFooterDrop(e, index); }} onDragEnd={clearFooterDrag} className={`drag-item flex items-center gap-0.5 rounded-lg border border-transparent ${dragFooterIndex === index ? 'drag-source' : ''} ${overFooterIndex === index && dragFooterIndex !== null ? 'drag-drop-target' : ''}`}>
                          {onReorderFooter && <span className="cursor-grab touch-none text-muted opacity-60 hover:opacity-100 shrink-0" title="Drag to reorder"><GripVertical className="h-3 w-3" /></span>}
                          <button type="button" onClick={() => onEdit({ type: 'footer-social', index })} className="edit-zone-hover p-2 text-muted -m-2 flex items-center justify-center" aria-label={label} title={label}>
                            {'iconUrl' in link && link.iconUrl ? <FooterCustomIcon url={link.iconUrl} sizeClass={iconSizeClass[iconSize]} /> : <Icon className={iconSizeClass[iconSize]} />}
                          </button>
                        </div>
                      );
                    })}
                    <button type="button" onClick={() => onEdit({ type: 'footer-social-new' })} className="edit-zone-hover flex items-center gap-1 rounded-full border border-dashed border-border p-2 text-muted" title="Add new link" aria-label="Add link"><Plus className="h-5 w-5" /></button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => onEdit({ type: 'footer-copyright' })} className={`edit-zone-hover text-center text-muted px-3 py-1 rounded ${copyrightSizeClass[copyrightSize]}`}>© {currentYear} {footer.copyrightName || 'Name'}</button>
                    <button type="button" onClick={() => onEdit({ type: 'footer-settings' })} className="edit-zone-hover p-1.5 rounded text-muted hover:text-[var(--foreground)]" title="Footer settings" aria-label="Footer settings"><Settings className="h-3.5 w-3.5" /></button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => onEdit({ type: 'footer-copyright' })} className={`edit-zone-hover text-center text-muted px-3 py-1 rounded ${copyrightSizeClass[copyrightSize]}`}>© {currentYear} {footer.copyrightName || 'Name'}</button>
                    <button type="button" onClick={() => onEdit({ type: 'footer-settings' })} className="edit-zone-hover p-1.5 rounded text-muted hover:text-[var(--foreground)]" title="Footer settings" aria-label="Footer settings"><Settings className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className={`flex flex-wrap items-center gap-6 ${socialJustify}`}>
                    {socialLinks.map((link, index) => {
                      const type = link.type;
                      const Icon = iconMap[type];
                      const label = getLinkLabel(link);
                      return (
                        <div key={`${type}-${index}`} draggable={!!onReorderFooter} onDragStart={(e) => { e.stopPropagation(); onReorderFooter && handleFooterDragStart(e, index); }} onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); onReorderFooter && handleFooterDragOver(e, index); }} onDrop={(e) => { e.preventDefault(); e.stopPropagation(); onReorderFooter && handleFooterDrop(e, index); }} onDragEnd={clearFooterDrag} className={`drag-item flex items-center gap-0.5 rounded-lg border border-transparent ${dragFooterIndex === index ? 'drag-source' : ''} ${overFooterIndex === index && dragFooterIndex !== null ? 'drag-drop-target' : ''}`}>
                          {onReorderFooter && <span className="cursor-grab touch-none text-muted opacity-60 hover:opacity-100 shrink-0" title="Drag to reorder"><GripVertical className="h-3 w-3" /></span>}
                          <button type="button" onClick={() => onEdit({ type: 'footer-social', index })} className="edit-zone-hover p-2 text-muted -m-2 flex items-center justify-center" aria-label={label} title={label}>
                            {'iconUrl' in link && link.iconUrl ? <FooterCustomIcon url={link.iconUrl} sizeClass={iconSizeClass[iconSize]} /> : <Icon className={iconSizeClass[iconSize]} />}
                          </button>
                        </div>
                      );
                    })}
                    <button type="button" onClick={() => onEdit({ type: 'footer-social-new' })} className="edit-zone-hover flex items-center gap-1 rounded-full border border-dashed border-border p-2 text-muted" title="Add new link" aria-label="Add link"><Plus className="h-5 w-5" /></button>
                  </div>
                </>
              )}
            </div>
          ) : (
            (() => {
              const socialRow = (
                <div className={`flex flex-wrap items-center gap-6 ${socialJustify}`}>
                  {socialLinks.map((link, index) => {
                    const type = link.type;
                    const Icon = iconMap[type];
                    const label = getLinkLabel(link);
                    return (
                      <div
                        key={`${type}-${index}`}
                        draggable={!!onReorderFooter}
                        onDragStart={(e) => { e.stopPropagation(); onReorderFooter && handleFooterDragStart(e, index); }}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); onReorderFooter && handleFooterDragOver(e, index); }}
                        onDrop={(e) => { e.preventDefault(); e.stopPropagation(); onReorderFooter && handleFooterDrop(e, index); }}
                        onDragEnd={clearFooterDrag}
                        className={`drag-item flex items-center gap-0.5 rounded-lg border border-transparent ${dragFooterIndex === index ? 'drag-source' : ''} ${overFooterIndex === index && dragFooterIndex !== null ? 'drag-drop-target' : ''}`}
                      >
                        {onReorderFooter && <span className="cursor-grab touch-none text-muted opacity-60 hover:opacity-100 shrink-0" title="Drag to reorder"><GripVertical className="h-3 w-3" /></span>}
                        <button type="button" onClick={() => onEdit({ type: 'footer-social', index })} className="edit-zone-hover p-2 text-muted -m-2 flex items-center justify-center" aria-label={label} title={label}>
                          {'iconUrl' in link && link.iconUrl ? <FooterCustomIcon url={link.iconUrl} sizeClass={iconSizeClass[iconSize]} /> : <Icon className={iconSizeClass[iconSize]} />}
                        </button>
                      </div>
                    );
                  })}
                  <button type="button" onClick={() => onEdit({ type: 'footer-social-new' })} className="edit-zone-hover flex items-center gap-1 rounded-full border border-dashed border-border p-2 text-muted" title="Add new link" aria-label="Add link"><Plus className="h-5 w-5" /></button>
                </div>
              );
              const copyrightRow = (
                <div className={`flex items-center gap-2 ${copyrightJustify}`}>
                  <button type="button" onClick={() => onEdit({ type: 'footer-copyright' })} className={`edit-zone-hover text-center text-muted px-3 py-1 rounded ${copyrightSizeClass[copyrightSize]}`}>© {currentYear} {footer.copyrightName || 'Name'}</button>
                  <button type="button" onClick={() => onEdit({ type: 'footer-settings' })} className="edit-zone-hover p-1.5 rounded text-muted hover:text-[var(--foreground)]" title="Footer settings" aria-label="Footer settings"><Settings className="h-3.5 w-3.5" /></button>
                </div>
              );
              const firstBlock = footerContentOrder === 'copyright-social' ? copyrightRow : socialRow;
              const secondBlock = footerContentOrder === 'copyright-social' ? socialRow : copyrightRow;
              return (
                <div className="flex flex-col gap-6">
                  <div className={`flex w-full ${footerContentOrder === 'social-copyright' ? socialJustify : copyrightJustify}`}>{firstBlock}</div>
                  <div className={`flex w-full ${footerContentOrder === 'social-copyright' ? copyrightJustify : socialJustify}`}>{secondBlock}</div>
                </div>
              );
            })()
          )}
        </div>
      </footer>
    </div>
  );
}
