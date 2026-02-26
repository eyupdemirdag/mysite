import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { siteConfig } from '@/lib/data';
import { DeletePageButton } from './DeletePageButton';

export const metadata = { title: 'Pages', robots: 'noindex' as const };

export default async function AdminPagesPage() {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const config = siteConfig.get();
  const customPages = config.customPages ?? [];

  return (
    <div className="p-8">
      <Link href="/admin" className="text-sm text-muted hover:text-[var(--foreground)]">
        ← Dashboard
      </Link>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Pages</h1>
        <Link
          href="/admin/pages/new"
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]"
        >
          New page
        </Link>
      </div>
      <p className="mt-1 text-muted">
        Custom pages appear in the header nav dropdown when adding or editing a link. URL: /p/[slug]
      </p>
      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        {customPages.length === 0 ? (
          <div className="px-4 py-8 text-center text-muted">
            No custom pages yet. Add one to link from the header or footer.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-[var(--surface-hover)]">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Slug (URL)</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {customPages.map((p) => (
                <tr key={p.slug} className="border-b border-border">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-muted">/p/{p.slug}</td>
                  <td className="px-4 py-3">
                    <DeletePageButton slug={p.slug} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
