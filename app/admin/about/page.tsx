import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { pageSections } from '@/lib/data';
import { PageSectionEditor } from '@/components/admin/PageSectionEditor';

export default async function AdminAboutPage() {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const sections = pageSections.get('about');

  return (
    <PageSectionEditor
      pageId="about"
      pageTitle="About"
      initialSections={sections}
      viewHref="/about"
      backHref="/admin/pages"
      backLabel="← Pages"
    />
  );
}
