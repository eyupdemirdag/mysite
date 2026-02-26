import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { pageSections } from '@/lib/data';
import { PageSectionEditor } from '@/components/admin/PageSectionEditor';

export default async function AdminTravelCustomizePage() {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const sections = pageSections.get('travel');

  return (
    <PageSectionEditor
      pageId="travel"
      pageTitle="Travel"
      initialSections={sections}
      viewHref="/travel"
      manageHref="/admin/travel"
      manageLabel="Manage entries"
    />
  );
}
