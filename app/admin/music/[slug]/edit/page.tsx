import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { music } from '@/lib/data';
import { MusicForm } from '@/components/admin/MusicForm';
import { isAdmin } from '@/lib/auth';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditMusicPage({ params }: Props) {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const { slug } = await params;
  const entry = music.getBySlug(slug);
  if (!entry) notFound();

  return (
    <div className="p-8">
      <Link href="/admin/music" className="text-sm text-muted hover:underline">
        ← Music
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-[var(--foreground)]">Edit: {entry.title}</h1>
      <MusicForm entry={entry} />
    </div>
  );
}
