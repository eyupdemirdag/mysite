import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { music } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata = { title: 'Music', robots: 'noindex' as const };

export default async function AdminMusicPage() {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const items = music.getAll(false);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Music</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/music/customize"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-[var(--surface-hover)]"
          >
            Customize page
          </Link>
          <Link
            href="/admin/music/new"
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]"
          >
            New entry
          </Link>
        </div>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-hover">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Artist</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((m) => (
              <tr key={m.slug} className="border-b border-border">
                <td className="px-4 py-3 font-medium">{m.title}</td>
                <td className="px-4 py-3 text-muted">{m.artist ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={m.published ? 'text-green-600' : 'text-muted'}>
                    {m.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/music/${m.slug}/edit`} className="text-[var(--accent)] hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
