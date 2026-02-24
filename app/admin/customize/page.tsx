import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { pageSections } from '@/lib/data';
import { CustomizeHomePage } from '@/components/admin/CustomizeHomePage';

export default async function AdminCustomizePage() {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const sections = pageSections.get('home');
  return <CustomizeHomePage initialSections={sections} />;
}
