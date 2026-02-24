'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GripVertical, Plus, Settings, Github, Instagram, Linkedin, Link2, Mail, Music } from 'lucide-react';
import type { SiteConfig, FooterSocialType, FooterSocialLink, SizeOption } from '@/lib/types';

const iconMap: Record<FooterSocialType | 'custom', typeof Mail> = { mail: Mail, linkedin: Linkedin, github: Github, instagram: Instagram, spotify: Music, custom: Link2 };
const labelMap: Record<FooterSocialType, string> = { mail: 'Email', linkedin: 'LinkedIn', github: 'GitHub', instagram: 'Instagram', spotify: 'Spotify' };
function getLinkLabel(link: FooterSocialLink): string {
  return link.type === 'custom' ? link.label : labelMap[link.type];
}

const nameSizeClass: Record<SizeOption, string> = { sm: 'text-xs', md: 'text-sm sm:text-base', lg: 'text-base sm:text-lg' };
const navSizeClass: Record<SizeOption, string> = { sm: 'text-xs', md: 'text-xs sm:text-sm', lg: 'text-sm sm:text-base' };
const iconSizeClass: Record<SizeOption, string> = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' };
const copyrightSizeClass: Record<SizeOption, string> = { sm: 'text-[10px]', md: 'text-xs', lg: 'text-sm' };

export type EditTarget =
  | { type: 'header-name' }
  | { type: 'header-size' }
  | { type: 'header-logo' }
  | { type: 'nav'; index: number }
  | { type: 'nav-new' }
  | { type: 'footer-copyright' }
  | { type: 'footer-size' }
  | { type: 'footer-social'; index: number }
  | { type: 'footer-social-new' }
  | null;

export function EditableSitePreview({
  config,
  onEdit,
  onReorderNav,
  onReorderFooter,
}: {
  config: SiteConfig;
  onEdit: (target: NonNullable<EditTarget>) => void;
  onReorderNav?: (newOrder: { href: string; label: string }[]) => void;
  onReorderFooter?: (newOrder: FooterSocialLink[]) => void;
}) {
  const { header, footer } = config;
  const currentYear = new Date().getFullYear();
  const [dragNavIndex, setDragNavIndex] = useState<number | null>(null);
  const [dragFooterIndex, setDragFooterIndex] = useState<number | null>(null);
  const [overNavIndex, setOverNavIndex] = useState<number | null>(null);
  const [overFooterIndex, setOverFooterIndex] = useState<number | null>(null);

  const nameSize = header.nameSize ?? 'md';
  const navSize = header.navSize ?? 'md';
  const iconSize = footer.iconSize ?? 'md';
  const copyrightSize = footer.copyrightSize ?? 'md';
  const socialLinks = footer.socialLinks ?? [];

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

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[var(--background)] shadow-2xl">
      {/* Header */}
      <header className="border-b border-border bg-[var(--surface)]/90">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-3 sm:px-6 sm:gap-3 sm:py-4">
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => onEdit({ type: 'header-logo' })}
              className="edit-zone-hover relative rounded-lg p-1 -m-1"
              title="Logoyu düzenle"
              aria-label="Logoyu düzenle"
            >
              <Image
                src={header.logoUrl || '/logo.png'}
                alt=""
                width={280}
                height={84}
                className="h-14 w-auto object-contain dark:invert-0 sm:h-20"
              />
            </button>
            <span className="h-8 w-px shrink-0 rounded-full bg-border sm:h-10" aria-hidden />
            <button
              type="button"
              onClick={() => onEdit({ type: 'header-name' })}
              className={`edit-zone-hover ml-2 font-semibold tracking-[0.2em] text-[var(--foreground)] uppercase sm:ml-3 px-2 py-1 -mx-2 -my-1 ${nameSizeClass[nameSize]}`}
            >
              {header.name || 'Adınız'}
            </button>
            <button
              type="button"
              onClick={() => onEdit({ type: 'header-size' })}
              className="edit-zone-hover p-1.5 rounded text-muted hover:text-[var(--foreground)]"
              title="Header boyutu"
              aria-label="Header boyut ayarları"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
          <nav className="w-full py-1">
            <div className="flex min-w-0 flex-nowrap items-center justify-center gap-2 sm:flex-wrap sm:gap-6">
              {header.navItems.map((item, index) => (
                <div
                  key={`${item.href}-${index}`}
                  draggable={!!onReorderNav}
                  onDragStart={(e) => onReorderNav && handleNavDragStart(e, index)}
                  onDragOver={(e) => onReorderNav && handleNavDragOver(e, index)}
                  onDrop={(e) => onReorderNav && handleNavDrop(e, index)}
                  onDragEnd={clearNavDrag}
                  className={`drag-item flex items-center gap-1 rounded-lg border border-transparent ${
                    dragNavIndex === index ? 'drag-source' : ''
                  } ${overNavIndex === index && dragNavIndex !== null ? 'drag-drop-target' : ''}`}
                >
                  {onReorderNav && (
                    <span className="cursor-grab touch-none text-muted opacity-70 hover:opacity-100" title="Sıralamak için sürükle">
                      <GripVertical className="h-3.5 w-3.5" />
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onEdit({ type: 'nav', index })}
                    className={`edit-zone-hover relative shrink-0 rounded-lg px-3 py-2 font-medium tracking-wide text-muted sm:min-w-[4.5rem] sm:px-4 sm:py-2.5 ${navSizeClass[navSize]}`}
                  >
                    {item.label || 'Link'}
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => onEdit({ type: 'nav-new' })}
                className="edit-zone-hover flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-2 text-xs font-medium text-muted sm:px-4 sm:py-2.5 sm:text-sm"
                title="Yeni menü linki ekle"
              >
                <Plus className="h-3.5 w-3.5" />
                Link ekle
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div className="flex h-24 items-center justify-center border-b border-border bg-[var(--surface)]/50">
        <span className="text-xs text-muted">Site içeriği</span>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center justify-center gap-6">
              {socialLinks.map((link, index) => {
                const type = link.type;
                const Icon = iconMap[type];
                const label = getLinkLabel(link);
                return (
                  <div
                    key={`${type}-${index}`}
                    draggable={!!onReorderFooter}
                    onDragStart={(e) => onReorderFooter && handleFooterDragStart(e, index)}
                    onDragOver={(e) => onReorderFooter && handleFooterDragOver(e, index)}
                    onDrop={(e) => onReorderFooter && handleFooterDrop(e, index)}
                    onDragEnd={clearFooterDrag}
                    className={`drag-item flex items-center gap-0.5 rounded-lg border border-transparent ${
                      dragFooterIndex === index ? 'drag-source' : ''
                    } ${overFooterIndex === index && dragFooterIndex !== null ? 'drag-drop-target' : ''}`}
                  >
                    {onReorderFooter && (
                      <span className="cursor-grab touch-none text-muted opacity-60 hover:opacity-100" title="Sıralamak için sürükle">
                        <GripVertical className="h-3 w-3" />
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => onEdit({ type: 'footer-social', index })}
                      className="edit-zone-hover p-2 text-muted -m-2 flex items-center justify-center"
                      aria-label={label}
                      title={label}
                    >
                      {'iconUrl' in link && link.iconUrl ? (
                        <img src={link.iconUrl} alt="" className={`object-contain ${iconSizeClass[iconSize]}`} />
                      ) : (
                        <Icon className={iconSizeClass[iconSize]} />
                      )}
                    </button>
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() => onEdit({ type: 'footer-social-new' })}
                className="edit-zone-hover flex items-center gap-1 rounded-full border border-dashed border-border p-2 text-muted"
                title="Yeni link ekle"
                aria-label="Link ekle"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit({ type: 'footer-copyright' })}
                className={`edit-zone-hover text-center text-muted px-3 py-1 rounded ${copyrightSizeClass[copyrightSize]}`}
              >
                © {currentYear} {footer.copyrightName || 'İsim'}
              </button>
              <button
                type="button"
                onClick={() => onEdit({ type: 'footer-size' })}
                className="edit-zone-hover p-1.5 rounded text-muted hover:text-[var(--foreground)]"
                title="Footer boyutu"
                aria-label="Footer boyut ayarları"
              >
                <Settings className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
