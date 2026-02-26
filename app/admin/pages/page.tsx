import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { siteConfig } from '@/lib/data';
import { DeletePageButton } from './DeletePageButton';
import { PageActiveToggle } from './PageActiveToggle';

export const metadata = { title: 'Pages', robots: 'noindex' as const };

// Order must match sidebar pagesNav (layout.tsx). Edit goes to section editor (customize).
const BUILTIN_PAGES: { path: string; label: string; editHref: string }[] = [
  { path: '/', label: 'Home', editHref: '/admin/customize' },
  { path: '/about', label: 'About', editHref: '/admin/about' },
  { path: '/projects', label: 'Projects', editHref: '/admin/projects/customize' },
  { path: '/travel', label: 'Travel', editHref: '/admin/travel/customize' },
  { path: '/music', label: 'Music', editHref: '/admin/music/customize' },
  { path: '/blog', label: 'Blog', editHref: '/admin/blog/customize' },
];

export default async function AdminPagesPage() {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const config = siteConfig.get();
  const customPages = config.customPages ?? [];
  const disabledBuiltin = new Set(config.disabledBuiltinPaths ?? []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Pages</h1>
        <Link
          href="/admin/pages/new"
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]"
        >
          New page
        </Link>
      </div>
      <p className="mt-1 text-muted">
        All pages currently on your site. Toggle Active/Inactive to show or hide in the site. Custom pages use URL /p/[slug].
      </p>
      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-[var(--surface-hover)]">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">URL</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {BUILTIN_PAGES.map((row) => (
              <tr key={row.path} className="border-b border-border">
                <td className="px-4 py-3 font-medium">{row.label}</td>
                <td className="px-4 py-3 text-muted">{row.path}</td>
                <td className="px-4 py-3">
                  <PageActiveToggle kind="builtin" path={row.path} active={!disabledBuiltin.has(row.path)} />
                </td>
                <td className="px-4 py-3">
                  <Link href={row.editHref} className="text-[var(--accent)] hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {customPages.map((p) => (
              <tr key={p.slug} className="border-b border-border">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 text-muted">/p/{p.slug}</td>
                <td className="px-4 py-3">
                  <PageActiveToggle kind="custom" slug={p.slug} active={p.active !== false} />
                </td>
                <td className="px-4 py-3 flex items-center gap-3">
                  <Link href={`/admin/pages/${p.slug}/edit`} className="text-[var(--accent)] hover:underline">
                    Edit
                  </Link>
                  <DeletePageButton slug={p.slug} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
