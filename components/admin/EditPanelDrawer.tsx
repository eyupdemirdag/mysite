'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { SiteConfig, FooterSocialType, FooterSocialLink, SizeOption } from '@/lib/types';
import { ImageUpload } from './ImageUpload';
import type { EditTarget } from './EditableSitePreview';

const SOCIAL_ORDER: FooterSocialType[] = ['mail', 'linkedin', 'github', 'instagram', 'spotify'];
const SOCIAL_LABELS: Record<FooterSocialType, string> = { mail: 'Email', linkedin: 'LinkedIn', github: 'GitHub', instagram: 'Instagram', spotify: 'Spotify' };
function getLinkLabel(link: FooterSocialLink): string {
  return link.type === 'custom' ? link.label : SOCIAL_LABELS[link.type];
}

/** Site içi sayfalar – menü ve özel linklerde seçenek olarak kullanılır */
const SITE_PAGES: { path: string; label: string }[] = [
  { path: '/', label: 'Ana Sayfa' },
  { path: '/about', label: 'Hakkımda' },
  { path: '/blog', label: 'Blog' },
  { path: '/projects', label: 'Projeler' },
  { path: '/travel', label: 'Seyahat' },
  { path: '/music', label: 'Müzik' },
];

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
        aria-label="Düzenle"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="font-semibold text-[var(--foreground)]">
              {target.type === 'header-name' && 'İsim'}
              {target.type === 'header-size' && 'Header boyutu'}
              {target.type === 'header-logo' && 'Logo'}
              {target.type === 'nav' && 'Menü linki'}
              {target.type === 'nav-new' && 'Yeni menü linki'}
              {target.type === 'footer-copyright' && 'Copyright'}
              {target.type === 'footer-size' && 'Footer boyutu'}
              {target.type === 'footer-social' && getLinkLabel(config.footer.socialLinks[target.index])}
              {target.type === 'footer-social-new' && 'Yeni link ekle'}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-2 text-muted hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
              aria-label="Kapat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {target.type === 'header-name' && (
              <HeaderNameForm
                value={config.header.name}
                onSave={handleHeaderName}
                onClose={onClose}
              />
            )}
            {target.type === 'header-logo' && (
              <LogoForm
                value={config.header.logoUrl ?? ''}
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
                onSave={(label, href) => {
                  handleNav(target.index, label, href);
                  onClose();
                }}
                onRemove={() => {
                  if (confirm('Bu menü linkini kaldırmak istediğinize emin misiniz?')) {
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
            {target.type === 'header-size' && (
              <HeaderSizeForm
                nameSize={config.header.nameSize ?? 'md'}
                navSize={config.header.navSize ?? 'md'}
                onSave={(nameSize, navSize) => {
                  onSave({ header: { ...config.header, nameSize, navSize } });
                  onClose();
                }}
                onClose={onClose}
              />
            )}
            {target.type === 'footer-size' && (
              <FooterSizeForm
                iconSize={config.footer.iconSize ?? 'md'}
                copyrightSize={config.footer.copyrightSize ?? 'md'}
                onSave={(iconSize, copyrightSize) => {
                  onSave({ footer: { ...config.footer, iconSize, copyrightSize } });
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

function LogoForm({ value, onSave, onClose }: { value: string; onSave: (url: string) => void; onClose: () => void }) {
  const [url, setUrl] = useState(value);
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-muted">Logo URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="/logo.png veya /uploads/..."
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        />
      </div>
      <div>
        <label className="block text-sm text-muted">Veya yeni görsel yükle</label>
        <ImageUpload
          value={url ? [url] : []}
          onChange={(urls) => setUrl(urls[0] ?? '')}
          multiple={false}
        />
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-[var(--surface-hover)]">İptal</button>
        <button type="button" onClick={() => onSave(url.trim())} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]">Kaydet</button>
      </div>
    </div>
  );
}

function HeaderNameForm({ value, onSave, onClose }: { value: string; onSave: (v: string) => void; onClose: () => void }) {
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
        <label className="block text-sm text-muted">Logo yanındaki isim</label>
        <input
          type="text"
          value={v}
          onChange={(e) => setV(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
          autoFocus
        />
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-[var(--surface-hover)]">
          İptal
        </button>
        <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]">
          Kaydet
        </button>
      </div>
    </form>
  );
}

function NavLinkForm({
  item,
  onSave,
  onRemove,
  onClose,
}: {
  item: { label: string; href: string };
  onSave: (label: string, href: string) => void;
  onRemove?: () => void;
  onClose: () => void;
}) {
  const [label, setLabel] = useState(item.label);
  const isCustomPath = item.href && !SITE_PAGES.some((p) => p.path === item.href);
  const [useCustom, setUseCustom] = useState(isCustomPath);
  const [customPath, setCustomPath] = useState(isCustomPath ? item.href : '');
  const selectedPath = useCustom ? customPath : (SITE_PAGES.find((p) => p.path === item.href)?.path ?? '/');
  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(label.trim() || item.label, (useCustom ? customPath : selectedPath).trim() || '/');
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm text-muted">Metin</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm text-muted">Sayfa</label>
          <select
            value={useCustom ? '__custom__' : selectedPath}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '__custom__') setUseCustom(true);
              else { setUseCustom(false); setCustomPath(''); }
            }}
            className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
          >
            {SITE_PAGES.map((p) => (
              <option key={p.path} value={p.path}>{p.label}</option>
            ))}
            <option value="__custom__">Özel URL</option>
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
            İptal
          </button>
          <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]">
            Kaydet
          </button>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove()}
              className="rounded-lg border border-red-500/50 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
            >
              Sil
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
        <label className="block text-sm text-muted">Copyright ismi</label>
        <input
          type="text"
          value={v}
          onChange={(e) => setV(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
          autoFocus
        />
        <p className="mt-1 text-xs text-muted">Görünüm: © {new Date().getFullYear()} [isim]</p>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-[var(--surface-hover)]">
          İptal
        </button>
        <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]">
          Kaydet
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
        <label className="block text-sm text-muted">{SOCIAL_LABELS[type]} linki</label>
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
          İptal
        </button>
        <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]">
          Kaydet
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
  const isCustomPath = link.href && !SITE_PAGES.some((p) => p.path === link.href);
  const [useCustomPath, setUseCustomPath] = useState(isCustom && isCustomPath);
  const [customPath, setCustomPath] = useState(isCustom && isCustomPath ? link.href : '');
  const selectedPath = useCustomPath ? customPath : (SITE_PAGES.find((p) => p.path === link.href)?.path ?? '/');
  const [socialHref, setSocialHref] = useState(!isCustom ? link.href : '');
  const href = isCustom ? (useCustomPath ? customPath : selectedPath) : socialHref;
  const [iconUrl, setIconUrl] = useState(currentIconUrl ?? '');
  const buildLink = (): FooterSocialLink => {
    const base = { href: href.trim(), ...(iconUrl.trim() ? { iconUrl: iconUrl.trim() } : {}) };
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
            <label className="block text-sm text-muted">Etiket</label>
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
          {isCustom ? (
            <>
              <label className="block text-sm text-muted">Sayfa</label>
              <select
                value={useCustomPath ? '__custom__' : selectedPath}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === '__custom__') setUseCustomPath(true);
                  else { setUseCustomPath(false); setCustomPath(''); }
                }}
                className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              >
                {SITE_PAGES.map((p) => (
                  <option key={p.path} value={p.path}>{p.label}</option>
                ))}
                <option value="__custom__">Özel URL</option>
              </select>
              {useCustomPath && (
                <input
                  type="text"
                  value={customPath}
                  onChange={(e) => setCustomPath(e.target.value)}
                  placeholder="/videos"
                  className="mt-2 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)] text-sm"
                />
              )}
            </>
          ) : (
            <>
              <label className="block text-sm text-muted">Link URL</label>
              <input
                type="text"
                value={socialHref}
                onChange={(e) => setSocialHref(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
                placeholder={link.type === 'mail' ? 'mailto:...' : 'https://...'}
              />
            </>
          )}
        </div>
        <div>
          <label className="block text-sm text-muted">İkon görseli (isteğe bağlı)</label>
          <input
            type="text"
            value={iconUrl}
            onChange={(e) => setIconUrl(e.target.value)}
            placeholder="Boş bırakırsan varsayılan ikon kullanılır"
            className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)] text-sm"
          />
          <ImageUpload value={iconUrl ? [iconUrl] : []} onChange={(urls) => setIconUrl(urls[0] ?? '')} multiple={false} />
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-[var(--surface-hover)]">İptal</button>
          <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]">Kaydet</button>
          <button
            type="button"
            onClick={() => confirm('Bu linki kaldırmak istediğinize emin misiniz?') && onRemove()}
            className="rounded-lg border border-red-500/50 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
          >
            Sil
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
  const [pagePath, setPagePath] = useState('/');
  const [useCustomPath, setUseCustomPath] = useState(false);
  const [customPath, setCustomPath] = useState('');
  const [socialHref, setSocialHref] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const href = type === 'custom' ? (useCustomPath ? customPath : pagePath) : socialHref;
  const buildLink = (): FooterSocialLink => {
    const base = { href: href.trim(), ...(iconUrl.trim() ? { iconUrl: iconUrl.trim() } : {}) };
    if (type === 'custom') return { type: 'custom', label: label.trim(), ...base };
    return { type, ...base };
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (type === 'custom' && !label.trim()) return;
        if (!href.trim()) return;
        onSave(buildLink());
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm text-muted">Tür</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as FooterSocialType | 'custom')}
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        >
          {SOCIAL_ORDER.map((t) => (
            <option key={t} value={t}>{SOCIAL_LABELS[t]}</option>
          ))}
          <option value="custom">Özel link</option>
        </select>
      </div>
      {type === 'custom' && (
        <div>
          <label className="block text-sm text-muted">Etiket</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Örn. YouTube"
            className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
          />
        </div>
      )}
      <div>
        {type === 'custom' ? (
          <>
            <label className="block text-sm text-muted">Sayfa</label>
            <select
              value={useCustomPath ? '__custom__' : pagePath}
              onChange={(e) => {
                const v = e.target.value;
                if (v === '__custom__') setUseCustomPath(true);
                else { setUseCustomPath(false); setPagePath(v); }
              }}
              className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
            >
              {SITE_PAGES.map((p) => (
                <option key={p.path} value={p.path}>{p.label}</option>
              ))}
              <option value="__custom__">Özel URL</option>
            </select>
            {useCustomPath && (
              <input
                type="text"
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
                placeholder="/videos"
                className="mt-2 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)] text-sm"
              />
            )}
          </>
        ) : (
          <>
            <label className="block text-sm text-muted">Link URL</label>
            <input
              type="text"
              value={socialHref}
              onChange={(e) => setSocialHref(e.target.value)}
              placeholder={type === 'mail' ? 'mailto:...' : 'https://...'}
              className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
            />
          </>
        )}
      </div>
      <div>
        <label className="block text-sm text-muted">İkon görseli (isteğe bağlı)</label>
        <input
          type="text"
          value={iconUrl}
          onChange={(e) => setIconUrl(e.target.value)}
          placeholder="Boş bırakırsan varsayılan ikon kullanılır"
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)] text-sm"
        />
        <ImageUpload value={iconUrl ? [iconUrl] : []} onChange={(urls) => setIconUrl(urls[0] ?? '')} multiple={false} />
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-[var(--surface-hover)]">İptal</button>
        <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]">Ekle</button>
      </div>
    </form>
  );
}

const SIZE_OPTIONS: { value: SizeOption; label: string }[] = [
  { value: 'sm', label: 'Küçük' },
  { value: 'md', label: 'Orta' },
  { value: 'lg', label: 'Büyük' },
];

function HeaderSizeForm({
  nameSize,
  navSize,
  onSave,
  onClose,
}: {
  nameSize: SizeOption;
  navSize: SizeOption;
  onSave: (nameSize: SizeOption, navSize: SizeOption) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(nameSize);
  const [nav, setNav] = useState(navSize);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(name, nav);
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm text-muted">Logo yanı isim boyutu</label>
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
        <label className="block text-sm text-muted">Menü linkleri boyutu</label>
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
      <div className="flex gap-2">
        <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-[var(--surface-hover)]">
          İptal
        </button>
        <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]">
          Kaydet
        </button>
      </div>
    </form>
  );
}

function FooterSizeForm({
  iconSize,
  copyrightSize,
  onSave,
  onClose,
}: {
  iconSize: SizeOption;
  copyrightSize: SizeOption;
  onSave: (iconSize: SizeOption, copyrightSize: SizeOption) => void;
  onClose: () => void;
}) {
  const [icon, setIcon] = useState(iconSize);
  const [copyright, setCopyright] = useState(copyrightSize);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(icon, copyright);
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm text-muted">Sosyal ikon boyutu</label>
        <select
          value={icon}
          onChange={(e) => setIcon(e.target.value as SizeOption)}
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        >
          {SIZE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm text-muted">Copyright metin boyutu</label>
        <select
          value={copyright}
          onChange={(e) => setCopyright(e.target.value as SizeOption)}
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        >
          {SIZE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-[var(--surface-hover)]">
          İptal
        </button>
        <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]">
          Kaydet
        </button>
      </div>
    </form>
  );
}

