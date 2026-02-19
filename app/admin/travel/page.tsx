import Link from 'next/link';
import { travel } from '@/lib/data';

export default function AdminTravelPage() {
  const items = travel.getAll(false);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Travel</h1>
        <Link
          href="/admin/travel/new"
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
        >
          New entry
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-hover">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.slug} className="border-b border-border">
                <td className="px-4 py-3 font-medium">{t.title}</td>
                <td className="px-4 py-3 text-muted">{t.location}</td>
                <td className="px-4 py-3">
                  <span className={t.published ? 'text-green-600' : 'text-muted'}>
                    {t.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/travel/${t.slug}/edit`} className="text-[var(--accent)] hover:underline">
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
