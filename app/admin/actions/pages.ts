'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { siteConfig as siteConfigData } from '@/lib/data';
import type { SiteConfig } from '@/lib/types';

export async function addCustomPage(page: { slug: string; title: string }) {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const slug = page.slug.trim().replace(/^\//, '').replace(/\/+/g, '-').toLowerCase() || 'page';
  const title = page.title.trim() || slug;
  const config = siteConfigData.get();
  const customPages = Array.isArray(config.customPages) ? [...config.customPages] : [];
  if (customPages.some((p) => p.slug === slug)) {
    throw new Error('A page with this slug already exists.');
  }
  customPages.push({ slug, title });
  siteConfigData.save({ ...config, customPages });
  revalidatePath('/', 'layout');
  revalidatePath('/admin/pages');
  revalidatePath(`/p/${slug}`);
  return { slug, title };
}

export async function removeCustomPage(slug: string) {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const config = siteConfigData.get();
  const customPages = (config.customPages || []).filter((p) => p.slug !== slug);
  siteConfigData.save({ ...config, customPages });
  revalidatePath('/', 'layout');
  revalidatePath('/admin/pages');
  revalidatePath(`/p/${slug}`);
}
