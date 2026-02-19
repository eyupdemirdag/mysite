import Link from 'next/link';
import { isAdmin } from '@/lib/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = { robots: 'noindex, nofollow' };

const adminNav = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/travel', label: 'Travel' },
  { href: '/admin/music', label: 'Music' },
  { href: '/admin/blog', label: 'Blog' },
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = typeof window === 'undefined' ? '' : '';
  const admin = await isAdmin();
  if (!admin) {
    return <>{children}</>;
  }
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <aside className="fixed left-0 top-0 z-40 h-screen w-56 border-r border-border bg-[var(--surface)]">
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link href="/admin" className="font-semibold text-[var(--foreground)]">
            Admin
          </Link>
        </div>
        <nav className="p-2">
          {adminNav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-surface-hover hover:text-[var(--foreground)]"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-2">
          <Link
            href="/"
            className="block rounded-md px-3 py-2 text-sm text-muted hover:bg-surface-hover hover:text-[var(--foreground)]"
          >
            ← Back to site
          </Link>
        </div>
      </aside>
      <div className="pl-56">{children}</div>
    </div>
  );
}
