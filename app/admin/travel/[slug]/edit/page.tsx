import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { travel } from '@/lib/data';
import { TravelForm } from '@/components/admin/TravelForm';
import { isAdmin } from '@/lib/auth';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditTravelPage({ params }: Props) {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const { slug } = await params;
  const entry = travel.getBySlug(slug);
  if (!entry) notFound();

  return (
    <div className="p-8">
      <Link href="/admin/travel" className="text-sm text-muted hover:underline">
        ← Travel
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-[var(--foreground)]">Edit: {entry.title}</h1>
      <TravelForm entry={entry} />
    </div>
  );
}
