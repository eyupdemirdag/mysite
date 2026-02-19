import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { FolderGit2, MapPin, Music, FileText } from 'lucide-react';

export default async function AdminDashboardPage() {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');

  const links = [
    { href: '/admin/projects', label: 'Projects', icon: FolderGit2 },
    { href: '/admin/travel', label: 'Travel', icon: MapPin },
    { href: '/admin/music', label: 'Music', icon: Music },
    { href: '/admin/blog', label: 'Blog', icon: FileText },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
      <p className="mt-1 text-muted">Manage your content.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 rounded-xl border border-border bg-surface p-6 transition-colors hover:border-[var(--accent)]/50 hover:bg-surface-hover"
          >
            <Icon className="h-8 w-8 text-[var(--accent)]" />
            <span className="font-medium text-[var(--foreground)]">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
