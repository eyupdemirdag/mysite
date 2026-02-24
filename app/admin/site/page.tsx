import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAdmin } from '@/lib/auth';
import { siteConfig } from '@/lib/data';
import { SiteConfigForm } from '@/components/admin/SiteConfigForm';

export default async function AdminSitePage() {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const config = siteConfig.get();
  return (
    <div className="p-8">
      <Link href="/admin" className="text-sm text-muted hover:text-[var(--foreground)]">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-[var(--foreground)]">
        Header & Footer
      </h1>
      <p className="mt-1 text-muted">
        Önizlemede alanlara tıklayarak düzenle; site arayüzü burada panele dönüşüyor.
      </p>
      <SiteConfigForm initialConfig={config} />
    </div>
  );
}
