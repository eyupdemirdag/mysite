'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { projects as projectsData } from '@/lib/data';
import type { Project } from '@/lib/types';

export async function saveProject(prev: unknown, formData: FormData) {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');

  const slug = (formData.get('slug') as string)?.trim() || '';
  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || '';
  const stackStr = (formData.get('stack') as string)?.trim() || '';
  const stack = stackStr ? stackStr.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const imagesStr = (formData.get('images') as string)?.trim() || '';
  const images = imagesStr ? JSON.parse(imagesStr) : [];
  const githubLink = (formData.get('githubLink') as string)?.trim() || undefined;
  const liveLink = (formData.get('liveLink') as string)?.trim() || undefined;
  const published = formData.get('published') === 'on';

  if (!title) return { error: 'Title is required' };

  const all = projectsData.getAll(false);
  const existing = all.find((p) => p.slug === slug);
  const newSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const finalSlug = existing ? existing.slug : newSlug;

  const now = new Date().toISOString();
  const item: Project = existing
    ? {
        ...existing,
        title,
        description,
        stack,
        images,
        githubLink,
        liveLink,
        published,
        updatedAt: now,
      }
    : {
        slug: finalSlug,
        title,
        description,
        stack,
        images,
        githubLink,
        liveLink,
        published,
        createdAt: now,
        updatedAt: now,
      };

  if (!existing) {
    if (all.some((p) => p.slug === finalSlug)) {
      return { error: 'A project with this slug already exists' };
    }
    all.push(item);
  } else {
    const idx = all.findIndex((p) => p.slug === slug);
    if (idx >= 0) all[idx] = item;
  }

  projectsData.saveAll(all);
  revalidatePath('/projects');
  revalidatePath('/projects/[slug]');
  revalidatePath('/admin/projects');
  if (existing) redirect(`/admin/projects`);
  redirect(`/admin/projects/${finalSlug}/edit`);
}

export async function deleteProject(slug: string) {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const all = projectsData.getAll(false).filter((p) => p.slug !== slug);
  projectsData.saveAll(all);
  revalidatePath('/projects');
  revalidatePath('/admin/projects');
  redirect('/admin/projects');
}
