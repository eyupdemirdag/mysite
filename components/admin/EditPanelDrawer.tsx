'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { SiteConfig, FooterSocialType, FooterSocialLink, SizeOption, HeaderAlignOption } from '@/lib/types';
import { ImageUpload } from './ImageUpload';
import type { EditTarget } from './EditableSitePreview';

const SOCIAL_ORDER: FooterSocialType[] = ['mail', 'linkedin', 'github', 'instagram', 'spotify'];
const SOCIAL_LABELS: Record<FooterSocialType, string> = { mail: 'Email', linkedin: 'LinkedIn', github: 'GitHub', instagram: 'Instagram', spotify: 'Spotify' };
function getLinkLabel(link: FooterSocialLink): string {
  return link.type === 'custom' ? link.label : SOCIAL_LABELS[link.type];
}

const BUILTIN_PAGES: { path: string; label: string }[] = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/blog', label: 'Blog' },
  { path: '/projects', label: 'Projects' },
  { path: '/travel', label: 'Travel' },
  { path: '/music', label: 'Music' },
];

function getSitePages(
  customPages: { slug: string; title: string; active?: boolean }[] = [],
  disabledBuiltinPaths: string[] = []
): { path: string; label: string }[] {
  const builtin = BUILTIN_PAGES.filter((p) => !disabledBuiltinPaths.includes(p.path));
  const custom = (customPages || []).filter((p) => p.active !== false).map((p) => ({ path: `/p/${p.slug}`, label: p.title }));
  return [...builtin, ...custom];
}

export function EditPanelDrawer({
  target,
  config,
  onClose,
  onSave,
}: {
  target: NonNullable<EditTarget>;
  config: SiteConfig;
  onClose: () => void;
  onSave: (updates: Partial<SiteConfig>) => void;
}) {
  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [onClose]);

  const handleHeaderName = (name: string) => onSave({ header: { ...config.header, name } });
  const handleNav = (index: number, label: string, href: string) => {
    const navItems = [...config.header.navItems];
    navItems[index] = { label, href };
    onSave({ header: { ...config.header, navItems } });
  };
  const handleCopyright = (copyrightName: string) => onSave({ footer: { ...config.footer, copyrightName } });
  const handleSocialByIndex = (index: number, link: FooterSocialLink) => {
    const socialLinks = [...config.footer.socialLinks];
    socialLinks[index] = link;
    onSave({ footer: { ...config.footer, socialLinks } });
  };
  const handleRemoveFooterLink = (index: number) => {
    const socialLinks = config.footer.socialLinks.filter((_, i) => i !== index);
    onSave({ footer: { ...config.footer, socialLinks } });
  };
  const handleRemoveNavItem = (index: number) => {
    const navItems = config.header.navItems.filter((_, i) => i !== index);
    onSave({ header: { ...config.header, navItems } });
  };
  const handleNavNew = (label: string, href: string) => {
    onSave({ header: { ...config.header, navItems: [...config.header.navItems, { label, href }] } });
  };
  const handleFooterSocialNew = (link: FooterSocialLink) => {
    onSave({ footer: { ...config.footer, socialLinks: [...config.footer.socialLinks, link] } });
  };
  const handleLogo = (logoUrl: string) => onSave({ header: { ...config.header, logoUrl } });

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-border bg-[var(--surface)] shadow-xl animate-panel-drawer-in"
        role="dialog"
        aria-label="Edit"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="font-semibold text-[var(--foreground)]">
              {target.type === 'header-name' && 'Name'}
              {target.type === 'header-settings' && 'Header settings'}
              {target.type === 'header-logo' && 'Logo'}
              {target.type === 'nav' && 'Menu link'}
              {target.type === 'nav-new' && 'New menu link'}
              {target.type === 'footer-copyright' && 'Copyright'}
              {target.type === 'footer-settings' && 'Footer settings'}
              {target.type === 'footer-social' && getLinkLabel(config.footer.socialLinks[target.index])}
              {target.type === 'footer-social-new' && 'Add new link'}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-2 text-muted hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {target.type === 'header-name' && (
              <HeaderNameForm
                value={config.header.name}
                hasLogo={Boolean(config.header.logoUrl?.trim())}
                onSave={handleHeaderName}
                onClose={onClose}
              />
            )}
            {target.type === 'header-logo' && (
              <LogoForm
                value={config.header.logoUrl ?? ''}
                hasName={Boolean(config.header.name?.trim())}
                onSave={(url) => {
                  handleLogo(url);
                  onClose();
                }}
                onClose={onClose}
              />
            )}
            {target.type === 'nav' && (
              <NavLinkForm
                item={config.header.navItems[target.index] ?? { label: '', href: '/' }}
                sitePages={getSitePages(config.customPages, config.disabledBuiltinPaths ?? [])}
                onSave={(label, href) => {
                  handleNav(target.index, label, href);
                  onClose();
                }}
                onRemove={() => {
                  if (confirm('Are you sure you want to remove this menu link?')) {
                    handleRemoveNavItem(target.index);
                    onClose();
                  }
                }}
                onClose={onClose}
              />
            )}
            {target.type === 'footer-copyright' && (
              <CopyrightForm
                value={config.footer.copyrightName}
                onSave={(v) => {
                  handleCopyright(v);
                  onClose();
                }}
                onClose={onClose}
              />
            )}
            {target.type === 'nav-new' && (
              <NavLinkForm
                item={{ label: '', href: '/' }}
                sitePages={getSitePages(config.customPages, config.disabledBuiltinPaths ?? [])}
                onSave={(label, href) => {
                  handleNavNew(label, href);
                  onClose();
                }}
                onClose={onClose}
              />
            )}
            {target.type === 'footer-social' && config.footer.socialLinks[target.index] && (
              <FooterSocialEditForm
                link={config.footer.socialLinks[target.index]}
                onSave={(link) => {
                  handleSocialByIndex(target.index, link);
                  onClose();
                }}
                onRemove={() => {
                  handleRemoveFooterLink(target.index);
                  onClose();
                }}
                onClose={onClose}
              />
            )}
            {target.type === 'footer-social-new' && (
              <FooterSocialNewForm
                onSave={(link) => {
                  handleFooterSocialNew(link);
                  onClose();
                }}
                onClose={onClose}
              />
            )}
            {target.type === 'header-settings' && (
              <HeaderSettingsForm
                nameSize={config.header.nameSize ?? 'md'}
                navSize={config.header.navSize ?? 'md'}
                headerAlign={config.header.headerAlign ?? 'center'}
                navAlign={config.header.navAlign ?? 'center'}
                onSave={(updates) => {
                  onSave({ header: { ...config.header, ...updates } });
                  onClose();
                }}
                onClose={onClose}
              />
            )}
            {target.type === 'footer-settings' && (
              <FooterSettingsForm
                iconSize={config.footer.iconSize ?? 'md'}
                copyrightSize={config.footer.copyrightSize ?? 'md'}
                socialAlign={config.footer.socialAlign ?? 'center'}
                copyrightAlign={config.footer.copyrightAlign ?? 'center'}
                onSave={(updates) => {
                  onSave({ footer: { ...config.footer, ...updates } });
                  onClose();
                }}
                onClose={onClose}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function LogoForm({
  value,
  hasName,
  onSave,
  onClose,
}: {
  value: string;
  hasName: boolean;
  onSave: (url: string) => void;
  onClose: () => void;
}) {
  const [url, setUrl] = useState(value);
  const handleDelete = () => {
    if (!hasName) {
      alert('Header must have at least one: logo or name. Add a name first.');
      return;
    }
    onSave('');
    onClose();
  };
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-muted">Upload logo image</label>
        <ImageUpload
          value={url ? [url] : []}
          onChange={(urls) => setUrl(urls[0] ?? '')}
          multiple={false}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-[var(--surface-hover)]">Cancel</button>
        <button type="button" onClick={() => onSave(url.trim())} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]">Save</button>
        {value ? (
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-red-500/50 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
          >
            Delete logo
          </button>
        ) : null}
      </div>
    </div>
  );
}

function HeaderNameForm({
  value,
  hasLogo,
  onSave,
  onClose,
}: {
  value: string;
  hasLogo: boolean;
  onSave: (v: string) => void;
  onClose: () => void;
}) {
  const [v, setV] = useState(value);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = v.trim();
    if (!trimmed && !hasLogo) {
      alert('Header must have at least one: logo or name. Add a logo first.');
      return;
    }
    onSave(trimmed);
    onClose();
  };
  const handleClear = () => {
    if (!hasLogo) {
      alert('Header must have at least one: logo or name. Delete the logo first or add a logo.');
      return;
    }
    onSave('');
    onClose();
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-muted">Name next to logo</label>
        <input
          type="text"
          value={v}
          onChange={(e) => setV(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
          autoFocus
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-[var(--surface-hover)]">
          Cancel
        </button>
        <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]">
          Save
        </button>
        {value ? (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg border border-red-500/50 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
          >
            Clear name
          </button>
        ) : null}
      </div>
    </form>
  );
}

function NavLinkForm({
  item,
  sitePages,
  onSave,
  onRemove,
  onClose,
}: {
  item: { label: string; href: string };
  sitePages: { path: string; label: string }[];
  onSave: (label: string, href: string) => void;
  onRemove?: () => void;
  onClose: () => void;
}) {
  const [label, setLabel] = useState(item.label);
  const isCustomPath = item.href && !sitePages.some((p) => p.path === item.href);
  const [useCustom, setUseCustom] = useState(isCustomPath);
  const [customPath, setCustomPath] = useState(isCustomPath ? item.href : '');
  const [selectedPath, setSelectedPath] = useState(() => {
    const found = sitePages.find((p) => p.path === item.href)?.path;
    return found ?? sitePages[0]?.path ?? '/';
  });
  const hrefToSave = useCustom ? customPath.trim() || '/' : selectedPath;
  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(label.trim() || item.label, hrefToSave);
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm text-muted">Text</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm text-muted">Page</label>
          <select
            value={useCustom ? '__custom__' : selectedPath}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '__custom__') {
                setUseCustom(true);
              } else {
                setUseCustom(false);
                setSelectedPath(v);
                setCustomPath('');
              }
            }}
            className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
          >
            {sitePages.map((p) => (
              <option key={p.path} value={p.path}>{p.label}</option>
            ))}
            <option value="__custom__">Custom URL</option>
          </select>
          {useCustom && (
            <input
              type="text"
              value={customPath}
              onChange={(e) => setCustomPath(e.target.value)}
              placeholder="/videos"
              className="mt-2 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)] text-sm"
            />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-[var(--surface-hover)]">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]">
            Save
          </button>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove()}
              className="rounded-lg border border-red-500/50 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function CopyrightForm({ value, onSave, onClose }: { value: string; onSave: (v: string) => void; onClose: () => void }) {
  const [v, setV] = useState(value);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(v.trim() || value);
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm text-muted">Copyright name</label>
        <input
          type="text"
          value={v}
          onChange={(e) => setV(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
          autoFocus
        />
        <p className="mt-1 text-xs text-muted">Preview: © {new Date().getFullYear()} [name]</p>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-[var(--surface-hover)]">
          Cancel
        </button>
        <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]">
          Save
        </button>
      </div>
    </form>
  );
}

function SocialLinkForm({
  type,
  value,
  onSave,
  onClose,
}: {
  type: FooterSocialType;
  value: string;
  onSave: (href: string) => void;
  onClose: () => void;
}) {
  const [href, setHref] = useState(value);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(href.trim());
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm text-muted">{SOCIAL_LABELS[type]} link</label>
        <input
          type="text"
          value={href}
          onChange={(e) => setHref(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
          placeholder={type === 'mail' ? 'mailto:email@example.com' : 'https://...'}
          autoFocus
        />
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-[var(--surface-hover)]">
          Cancel
        </button>
        <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]">
          Save
        </button>
      </div>
    </form>
  );
}

function FooterSocialEditForm({
  link,
  onSave,
  onRemove,
  onClose,
}: {
  link: FooterSocialLink;
  onSave: (link: FooterSocialLink) => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  const isCustom = link.type === 'custom';
  const currentIconUrl = 'iconUrl' in link ? link.iconUrl : undefined;
  const [label, setLabel] = useState(isCustom ? link.label : '');
  const [href, setHref] = useState(link.href);
  const [iconUrl, setIconUrl] = useState(currentIconUrl ?? '');
  const isMail = link.type === 'mail';
  const mailDisplayValue = isMail ? (href || '').replace(/^mailto:/i, '') : href;
  const buildLink = (): FooterSocialLink => {
    const finalHref = isMail ? `mailto:${(href || '').replace(/^mailto:/i, '').trim()}` : href.trim();
    const icon = iconUrl.trim();
    const iconOk = icon && icon.toLowerCase().endsWith('.png');
    const base = { href: finalHref, ...(iconOk ? { iconUrl: icon } : {}) };
    if (isCustom) return { type: 'custom', label: label.trim() || (link.type === 'custom' ? link.label : ''), ...base };
    return { type: link.type as FooterSocialType, ...base };
  };
  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(buildLink());
        }}
        className="space-y-4"
      >
        {isCustom && (
          <div>
            <label className="block text-sm text-muted">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
            />
          </div>
        )}
        {!isCustom && <p className="text-sm text-muted">{SOCIAL_LABELS[link.type as FooterSocialType]}</p>}
        <div>
          {isMail ? (
            <>
              <label className="block text-sm text-muted">Email address</label>
              <input
                type="email"
                value={mailDisplayValue}
                onChange={(e) => setHref('mailto:' + e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
                placeholder="name@example.com"
              />
            </>
          ) : (
            <>
              <label className="block text-sm text-muted">Link URL</label>
              <input
                type="text"
                value={href}
                onChange={(e) => setHref(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
                placeholder="https://..."
              />
              <p className="mt-1 text-xs text-muted">External links only. Not for site pages.</p>
            </>
          )}
        </div>
        <div>
          <label className="block text-sm text-muted">Icon image (optional, PNG only)</label>
          <ImageUpload value={iconUrl ? [iconUrl] : []} onChange={(urls) => setIconUrl(urls[0] ?? '')} multiple={false} accept="image/png" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-[var(--surface-hover)]">Cancel</button>
          <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]">Save</button>
          <button
            type="button"
            onClick={() => confirm('Are you sure you want to remove this link?') && onRemove()}
            className="rounded-lg border border-red-500/50 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}

function FooterSocialNewForm({
  onSave,
  onClose,
}: {
  onSave: (link: FooterSocialLink) => void;
  onClose: () => void;
}) {
  const [type, setType] = useState<FooterSocialType | 'custom'>('custom');
  const [label, setLabel] = useState('');
  const [href, setHref] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const isMail = type === 'mail';
  const buildLink = (): FooterSocialLink => {
    const finalHref = isMail ? `mailto:${href.trim()}` : href.trim();
    const icon = iconUrl.trim();
    const iconOk = icon && icon.toLowerCase().endsWith('.png');
    const base = { href: finalHref, ...(iconOk ? { iconUrl: icon } : {}) };
    if (type === 'custom') return { type: 'custom', label: label.trim(), ...base };
    return { type, ...base };
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (type === 'custom' && !label.trim()) return;
        if (isMail ? !href.trim() : !href.trim()) return;
        onSave(buildLink());
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm text-muted">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as FooterSocialType | 'custom')}
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        >
          {SOCIAL_ORDER.map((t) => (
            <option key={t} value={t}>{SOCIAL_LABELS[t]}</option>
          ))}
          <option value="custom">Custom link</option>
        </select>
      </div>
      {type === 'custom' && (
        <div>
          <label className="block text-sm text-muted">Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. YouTube"
            className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
          />
        </div>
      )}
      <div>
        {isMail ? (
          <>
            <label className="block text-sm text-muted">Email address</label>
            <input
              type="email"
              value={href}
              onChange={(e) => setHref(e.target.value)}
              placeholder="name@example.com"
              className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
            />
            <p className="mt-1 text-xs text-muted">mailto: is added automatically.</p>
          </>
        ) : (
          <>
            <label className="block text-sm text-muted">Link URL</label>
            <input
              type="text"
              value={href}
              onChange={(e) => setHref(e.target.value)}
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
            />
            <p className="mt-1 text-xs text-muted">External links only. Not for site pages.</p>
          </>
        )}
      </div>
      <div>
        <label className="block text-sm text-muted">Icon image (optional, PNG only)</label>
        <ImageUpload value={iconUrl ? [iconUrl] : []} onChange={(urls) => setIconUrl(urls[0] ?? '')} multiple={false} accept="image/png" />
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-[var(--surface-hover)]">Cancel</button>
        <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]">Add</button>
      </div>
    </form>
  );
}

const ALIGN_OPTIONS: { value: HeaderAlignOption; label: string }[] = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

const SIZE_OPTIONS: { value: SizeOption; label: string }[] = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
];

function HeaderSettingsForm({
  nameSize,
  navSize,
  headerAlign,
  navAlign,
  onSave,
  onClose,
}: {
  nameSize: SizeOption;
  navSize: SizeOption;
  headerAlign: HeaderAlignOption;
  navAlign: HeaderAlignOption;
  onSave: (updates: { nameSize: SizeOption; navSize: SizeOption; headerAlign: HeaderAlignOption; navAlign: HeaderAlignOption }) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(nameSize);
  const [nav, setNav] = useState(navSize);
  const [header, setHeader] = useState(headerAlign);
  const [navA, setNavA] = useState(navAlign);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ nameSize: name, navSize: nav, headerAlign: header, navAlign: navA });
      }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-[var(--foreground)]">Size</h4>
        <div>
          <label className="block text-sm text-muted">Name next to logo size</label>
          <select
            value={name}
            onChange={(e) => setName(e.target.value as SizeOption)}
            className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
          >
            {SIZE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted">Menu links size</label>
          <select
            value={nav}
            onChange={(e) => setNav(e.target.value as SizeOption)}
            className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
          >
            {SIZE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-[var(--foreground)]">Alignment</h4>
        <p className="text-xs text-muted">
          When logo is on one side and nav on the other (e.g. left + right), they appear in one row.
        </p>
        <div>
          <label className="block text-sm text-muted">Logo + name position</label>
          <select
            value={header}
            onChange={(e) => setHeader(e.target.value as HeaderAlignOption)}
            className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
          >
            {ALIGN_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted">Navigation bar position</label>
          <select
            value={navA}
            onChange={(e) => setNavA(e.target.value as HeaderAlignOption)}
            className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
          >
            {ALIGN_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-[var(--surface-hover)]">Cancel</button>
        <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]">Save</button>
      </div>
    </form>
  );
}

function FooterSettingsForm({
  iconSize,
  copyrightSize,
  socialAlign,
  copyrightAlign,
  onSave,
  onClose,
}: {
  iconSize: SizeOption;
  copyrightSize: SizeOption;
  socialAlign: HeaderAlignOption;
  copyrightAlign: HeaderAlignOption;
  onSave: (updates: { iconSize: SizeOption; copyrightSize: SizeOption; socialAlign: HeaderAlignOption; copyrightAlign: HeaderAlignOption }) => void;
  onClose: () => void;
}) {
  const [icon, setIcon] = useState(iconSize);
  const [copyright, setCopyright] = useState(copyrightSize);
  const [social, setSocial] = useState(socialAlign);
  const [copyrightA, setCopyrightA] = useState(copyrightAlign);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ iconSize: icon, copyrightSize: copyright, socialAlign: social, copyrightAlign: copyrightA });
      }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-[var(--foreground)]">Size</h4>
        <div>
          <label className="block text-sm text-muted">Social icon size</label>
          <select value={icon} onChange={(e) => setIcon(e.target.value as SizeOption)} className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]">
            {SIZE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted">Copyright text size</label>
          <select value={copyright} onChange={(e) => setCopyright(e.target.value as SizeOption)} className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]">
            {SIZE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-[var(--foreground)]">Alignment</h4>
        <p className="text-xs text-muted">When social is on one side and copyright on the other, they appear in one row.</p>
        <div>
          <label className="block text-sm text-muted">Social icons position</label>
          <select value={social} onChange={(e) => setSocial(e.target.value as HeaderAlignOption)} className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]">
            {ALIGN_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted">Copyright position</label>
          <select value={copyrightA} onChange={(e) => setCopyrightA(e.target.value as HeaderAlignOption)} className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]">
            {ALIGN_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-[var(--surface-hover)]">Cancel</button>
        <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]">Save</button>
      </div>
    </form>
  );
}

