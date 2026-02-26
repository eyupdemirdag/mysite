import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { siteConfig } from '@/lib/data';
import { SiteConfigForm } from '@/components/admin/SiteConfigForm';

export default async function AdminSitePage() {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const config = siteConfig.get();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">
        Header & Footer
      </h1>
      <p className="mt-1 text-muted">
        Edit by clicking on fields in the preview; the site interface turns into a panel here.
      </p>
      <SiteConfigForm initialConfig={config} />
    </div>
  );
}
