'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { siteConfig as siteConfigData } from '@/lib/data';
import type { SiteConfig } from '@/lib/types';

export async function saveSiteConfig(config: SiteConfig) {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  siteConfigData.save(config);
  revalidatePath('/', 'layout');
  revalidatePath('/admin/site');
}
