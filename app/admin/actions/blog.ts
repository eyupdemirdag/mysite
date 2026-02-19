'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { blog as blogData } from '@/lib/data';
import type { BlogPost } from '@/lib/types';

export async function saveBlog(prev: unknown, formData: FormData) {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');

  const slug = (formData.get('slug') as string)?.trim() || '';
  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || '';
  const content = (formData.get('content') as string)?.trim() || '';
  const published = formData.get('published') === 'on';

  if (!title) return { error: 'Title is required' };

  const all = blogData.getAll(false);
  const existing = all.find((b) => b.slug === slug);
  const newSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const finalSlug = existing ? existing.slug : newSlug;

  const now = new Date().toISOString();
  const item: BlogPost = existing
    ? {
        ...existing,
        title,
        description,
        content,
        published,
        updatedAt: now,
      }
    : {
        slug: finalSlug,
        title,
        description,
        content,
        published,
        createdAt: now,
        updatedAt: now,
      };

  if (!existing) {
    if (all.some((b) => b.slug === finalSlug)) {
      return { error: 'A post with this slug already exists' };
    }
    all.push(item);
  } else {
    const idx = all.findIndex((b) => b.slug === slug);
    if (idx >= 0) all[idx] = item;
  }

  blogData.saveAll(all);
  revalidatePath('/blog');
  revalidatePath('/blog/[slug]');
  revalidatePath('/admin/blog');
  if (existing) redirect('/admin/blog');
  redirect(`/admin/blog/${finalSlug}/edit`);
}

export async function deleteBlog(slug: string) {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const all = blogData.getAll(false).filter((b) => b.slug !== slug);
  blogData.saveAll(all);
  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  redirect('/admin/blog');
}
