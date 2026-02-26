import { notFound, redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { pageSections, siteConfig } from '@/lib/data';
import { PageSectionEditor } from '@/components/admin/PageSectionEditor';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditCustomPageRoute({ params }: Props) {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const { slug } = await params;
  const config = siteConfig.get();
  const page = (config.customPages ?? []).find((p) => p.slug === slug);
  if (!page) notFound();

  const pageId = `p-${slug}`;
  const sections = pageSections.get(pageId);

  return (
    <PageSectionEditor
      pageId={pageId}
      pageTitle={page.title}
      initialSections={sections}
      viewHref={`/p/${slug}`}
      backHref="/admin/pages"
      backLabel="← Pages"
    />
  );
}
