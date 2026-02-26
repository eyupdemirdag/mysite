'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { pageSections as pageSectionsData } from '@/lib/data';
import type { PageSection } from '@/lib/types';

function pathForPageId(pageId: string): string {
  if (pageId === 'home') return '/';
  if (pageId.startsWith('p-')) return `/p/${pageId.slice(2)}`;
  return `/${pageId}`;
}

export async function savePageSections(pageId: string, sections: PageSection[]) {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  pageSectionsData.save(pageId, sections);
  revalidatePath(pathForPageId(pageId));
  revalidatePath('/', 'layout');
}
