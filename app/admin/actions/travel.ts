'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { travel as travelData } from '@/lib/data';
import type { TravelEntry } from '@/lib/types';

export async function saveTravel(prev: unknown, formData: FormData) {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');

  const slug = (formData.get('slug') as string)?.trim() || '';
  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || '';
  const location = (formData.get('location') as string)?.trim() || '';
  const imagesStr = (formData.get('images') as string)?.trim() || '';
  const images = imagesStr ? JSON.parse(imagesStr) : [];
  const date = (formData.get('date') as string)?.trim() || '';
  const published = formData.get('published') === 'on';

  if (!title) return { error: 'Title is required' };

  const all = travelData.getAll(false);
  const existing = all.find((t) => t.slug === slug);
  const newSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const finalSlug = existing ? existing.slug : newSlug;

  const now = new Date().toISOString();
  const item: TravelEntry = existing
    ? {
        ...existing,
        title,
        description,
        location,
        images,
        date,
        published,
        updatedAt: now,
      }
    : {
        slug: finalSlug,
        title,
        description,
        location,
        images,
        date,
        published,
        createdAt: now,
        updatedAt: now,
      };

  if (!existing) {
    if (all.some((t) => t.slug === finalSlug)) {
      return { error: 'An entry with this slug already exists' };
    }
    all.push(item);
  } else {
    const idx = all.findIndex((t) => t.slug === slug);
    if (idx >= 0) all[idx] = item;
  }

  travelData.saveAll(all);
  revalidatePath('/travel');
  revalidatePath('/travel/[slug]');
  revalidatePath('/admin/travel');
  if (existing) redirect('/admin/travel');
  redirect(`/admin/travel/${finalSlug}/edit`);
}

export async function deleteTravel(slug: string) {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const all = travelData.getAll(false).filter((t) => t.slug !== slug);
  travelData.saveAll(all);
  revalidatePath('/travel');
  revalidatePath('/admin/travel');
  redirect('/admin/travel');
}
