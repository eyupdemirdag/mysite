import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { pageSections } from '@/lib/data';
import { PageSectionEditor } from '@/components/admin/PageSectionEditor';

export default async function AdminProjectsCustomizePage() {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const sections = pageSections.get('projects');

  return (
    <PageSectionEditor
      pageId="projects"
      pageTitle="Projects"
      initialSections={sections}
      viewHref="/projects"
      manageHref="/admin/projects"
      manageLabel="Manage projects"
    />
  );
}
