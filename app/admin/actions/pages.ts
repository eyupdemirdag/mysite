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
  customPages.push({ slug, title, active: true });
  siteConfigData.save({ ...config, customPages });
  revalidatePath('/', 'layout');
  revalidatePath('/admin/pages');
  revalidatePath(`/p/${slug}`);
  return { slug, title };
}

export async function updateCustomPage(
  currentSlug: string,
  updates: { title?: string; slug?: string }
) {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const config = siteConfigData.get();
  const customPages = Array.isArray(config.customPages) ? [...config.customPages] : [];
  const index = customPages.findIndex((p) => p.slug === currentSlug);
  if (index === -1) throw new Error('Page not found.');
  const newSlug = updates.slug !== undefined
    ? updates.slug.trim().replace(/^\//, '').replace(/\/+/g, '-').toLowerCase() || currentSlug
    : currentSlug;
  const newTitle = updates.title !== undefined ? updates.title.trim() || customPages[index].title : customPages[index].title;
  if (newSlug !== currentSlug && customPages.some((p) => p.slug === newSlug)) {
    throw new Error('A page with this slug already exists.');
  }
  customPages[index] = { ...customPages[index], slug: newSlug, title: newTitle };
  siteConfigData.save({ ...config, customPages });
  revalidatePath('/', 'layout');
  revalidatePath('/admin/pages');
  revalidatePath(`/p/${currentSlug}`);
  if (newSlug !== currentSlug) revalidatePath(`/p/${newSlug}`);
  return { slug: newSlug, title: newTitle };
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

export async function setCustomPageActive(slug: string, active: boolean) {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const config = siteConfigData.get();
  const customPages = (config.customPages || []).map((p) =>
    p.slug === slug ? { ...p, active } : p
  );
  siteConfigData.save({ ...config, customPages });
  revalidatePath('/', 'layout');
  revalidatePath('/admin/pages');
  revalidatePath(`/p/${slug}`);
}

export async function setBuiltinPageActive(path: string, active: boolean) {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const config = siteConfigData.get();
  const disabled = config.disabledBuiltinPaths ?? [];
  const next = active
    ? disabled.filter((p) => p !== path)
    : disabled.includes(path)
      ? disabled
      : [...disabled, path];
  siteConfigData.save({ ...config, disabledBuiltinPaths: next });
  revalidatePath('/', 'layout');
  revalidatePath('/admin/pages');
}
