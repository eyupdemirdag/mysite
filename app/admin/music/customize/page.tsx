import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { pageSections } from '@/lib/data';
import { PageSectionEditor } from '@/components/admin/PageSectionEditor';

export default async function AdminMusicCustomizePage() {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const sections = pageSections.get('music');

  return (
    <PageSectionEditor
      pageId="music"
      pageTitle="Music"
      initialSections={sections}
      viewHref="/music"
      manageHref="/admin/music"
      manageLabel="Manage entries"
    />
  );
}
