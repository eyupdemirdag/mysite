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
        Click the area you want to edit in the preview; the panel will open. Press the button below to apply changes to the site.
      </p>

      {/* Site preview – panel transition animation */}
      <div className="animate-panel-frame-in">
        <EditableSitePreview
          config={config}
          onEdit={handleEdit}
          onReorderNav={(newOrder) => setConfig((c) => ({ ...c, header: { ...c.header, navItems: newOrder } }))}
          onReorderFooter={(newOrder) => setConfig((c) => ({ ...c, footer: { ...c.footer, socialLinks: newOrder } }))}
          onReorderBrand={(order) => setConfig((c) => ({ ...c, header: { ...c.header, brandOrder: order } }))}
        />
      </div>

      {/* Save to site + View site */}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleSaveToSite}
          disabled={saving}
          className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save to site'}
        </button>
        {saved && (
          <span className="text-sm text-[var(--accent)]">
            Saved.
          </span>
        )}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted hover:text-[var(--foreground)] transition-colors"
        >
          Open site →
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
