'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { music as musicData } from '@/lib/data';
import type { MusicEntry } from '@/lib/types';

export async function saveMusic(prev: unknown, formData: FormData) {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');

  const slug = (formData.get('slug') as string)?.trim() || '';
  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || '';
  const artist = (formData.get('artist') as string)?.trim() || undefined;
  const spotifyEmbedUrl = (formData.get('spotifyEmbedUrl') as string)?.trim() || undefined;
  const coverStr = (formData.get('coverImage') as string)?.trim() || '';
  const coverImage = coverStr ? (JSON.parse(coverStr) as string[])[0] : undefined;
  const published = formData.get('published') === 'on';

  if (!title) return { error: 'Title is required' };

  const all = musicData.getAll(false);
  const existing = all.find((m) => m.slug === slug);
  const newSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const finalSlug = existing ? existing.slug : newSlug;

  const now = new Date().toISOString();
  const item: MusicEntry = existing
    ? {
        ...existing,
        title,
        description,
        artist,
        spotifyEmbedUrl,
        coverImage,
        published,
        updatedAt: now,
      }
    : {
        slug: finalSlug,
        title,
        description,
        artist,
        spotifyEmbedUrl,
        coverImage,
        published,
        createdAt: now,
        updatedAt: now,
      };

  if (!existing) {
    if (all.some((m) => m.slug === finalSlug)) {
      return { error: 'An entry with this slug already exists' };
    }
    all.push(item);
  } else {
    const idx = all.findIndex((m) => m.slug === slug);
    if (idx >= 0) all[idx] = item;
  }

  musicData.saveAll(all);
  revalidatePath('/music');
  revalidatePath('/music/[slug]');
  revalidatePath('/admin/music');
  if (existing) redirect('/admin/music');
  redirect(`/admin/music/${finalSlug}/edit`);
}

export async function deleteMusic(slug: string) {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const all = musicData.getAll(false).filter((m) => m.slug !== slug);
  musicData.saveAll(all);
  revalidatePath('/music');
  revalidatePath('/admin/music');
  redirect('/admin/music');
}
