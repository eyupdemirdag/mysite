'use client';

import { useState } from 'react';
import Link from 'next/link';
import { saveSiteConfig } from '@/app/admin/actions/site-config';
import type { SiteConfig } from '@/lib/types';
import type { EditTarget } from './EditableSitePreview';
import { EditableSitePreview } from './EditableSitePreview';
import { EditPanelDrawer } from './EditPanelDrawer';

export function SiteConfigForm({ initialConfig }: { initialConfig: SiteConfig }) {
  const [config, setConfig] = useState(initialConfig);
  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleEdit = (target: NonNullable<EditTarget>) => setEditTarget(target);
  const handleCloseDrawer = () => setEditTarget(null);
  const handleDrawerSave = (updates: Partial<SiteConfig>) => {
    setConfig((c) => ({ ...c, ...updates }));
    setEditTarget(null);
  };

  async function handleSaveToSite() {
    setSaving(true);
    setSaved(false);
    await saveSiteConfig(config);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="mt-8">
      <p className="mb-6 text-sm text-muted">
        Önizlemede düzenlemek istediğin alana tıkla; panel açılacak. Değişiklikleri siteye yansıtmak için aşağıdaki butona bas.
      </p>

      {/* Site önizlemesi – panele dönüşüm animasyonu */}
      <div className="animate-panel-frame-in">
        <EditableSitePreview
          config={config}
          onEdit={handleEdit}
          onReorderNav={(newOrder) => setConfig((c) => ({ ...c, header: { ...c.header, navItems: newOrder } }))}
          onReorderFooter={(newOrder) => setConfig((c) => ({ ...c, footer: { ...c.footer, socialLinks: newOrder } }))}
        />
      </div>

      {/* Siteye kaydet + View site */}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleSaveToSite}
          disabled={saving}
          className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
        >
          {saving ? 'Kaydediliyor…' : 'Siteye kaydet'}
        </button>
        {saved && (
          <span className="text-sm text-[var(--accent)]">
            Kaydedildi.
          </span>
        )}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted hover:text-[var(--foreground)] transition-colors"
        >
          Siteyi aç →
        </Link>
      </div>

      {editTarget && (
        <EditPanelDrawer
          target={editTarget}
          config={config}
          onClose={handleCloseDrawer}
          onSave={handleDrawerSave}
        />
      )}
    </div>
  );
}
