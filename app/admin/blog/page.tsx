import Link from 'next/link';
import { blog } from '@/lib/data';

export default function AdminBlogPage() {
  const items = blog.getAll(false);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
        >
          New post
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-hover">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr key={b.slug} className="border-b border-border">
                <td className="px-4 py-3 font-medium">{b.title}</td>
                <td className="px-4 py-3">
                  <span className={b.published ? 'text-green-600' : 'text-muted'}>
                    {b.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/blog/${b.slug}/edit`} className="text-[var(--accent)] hover:underline">
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
