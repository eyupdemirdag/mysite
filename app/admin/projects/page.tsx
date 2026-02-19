import Link from 'next/link';
import { projects } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Projects', robots: 'noindex' };

export default function AdminProjectsPage() {
  const items = projects.getAll(false);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
        >
          New project
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-hover">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.slug} className="border-b border-border">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3">
                  <span className={p.published ? 'text-green-600' : 'text-muted'}>
                    {p.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">
                  {new Date(p.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/projects/${p.slug}/edit`}
                    className="text-[var(--accent)] hover:underline"
                  >
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
