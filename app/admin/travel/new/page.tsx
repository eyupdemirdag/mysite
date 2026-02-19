import { redirect } from 'next/navigation';
import { TravelForm } from '@/components/admin/TravelForm';
import { isAdmin } from '@/lib/auth';

export default async function NewTravelPage() {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">New travel entry</h1>
      <TravelForm />
    </div>
  );
}
