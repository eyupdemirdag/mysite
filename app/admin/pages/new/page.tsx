'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addCustomPage } from '@/app/admin/actions/pages';

export default function AdminPagesNewPage() {
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    setSaving(true);
    try {
      await addCustomPage({ slug: slug.trim() || title.trim(), title: title.trim() });
      router.push('/admin/pages');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add page.');
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      <Link href="/admin/pages" className="text-sm text-muted hover:text-[var(--foreground)]">
        ← Pages
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-[var(--foreground)]">New page</h1>
      <p className="mt-1 text-muted">
        Add a custom page. It will be available at /p/[slug] and in the nav link dropdown.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Contact"
            className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Slug (optional)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Leave empty to use title (e.g. contact)"
            className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
          />
          <p className="mt-1 text-xs text-muted">URL will be /p/[slug]. Lowercase, no spaces.</p>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)] disabled:opacity-50"
          >
            {saving ? 'Adding…' : 'Add page'}
          </button>
          <Link
            href="/admin/pages"
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-[var(--surface-hover)]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
