import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { pageSections } from '@/lib/data';
import { PageSectionEditor } from '@/components/admin/PageSectionEditor';

export default async function AdminBlogCustomizePage() {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const sections = pageSections.get('blog');

  return (
    <PageSectionEditor
      pageId="blog"
      pageTitle="Blog"
      initialSections={sections}
      viewHref="/blog"
      manageHref="/admin/blog"
      manageLabel="Manage posts"
    />
  );
}
