'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ImageUpload } from './ImageUpload';
import { saveTravel, deleteTravel } from '@/app/admin/actions/travel';
import type { TravelEntry } from '@/lib/types';

type Props = { entry?: TravelEntry };

export function TravelForm({ entry }: Props) {
  const [images, setImages] = useState<string[]>(entry?.images ?? []);
  const isEdit = !!entry;

  return (
    <form action={saveTravel} className="mt-6 max-w-2xl space-y-6">
      {isEdit && <input type="hidden" name="slug" value={entry.slug} />}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">Title *</label>
        <input
          type="text"
          name="title"
          defaultValue={entry?.title}
          required
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">Slug (URL)</label>
        <input
          type="text"
          name="slug"
          defaultValue={entry?.slug}
          placeholder="my-trip"
          readOnly={isEdit}
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">Location</label>
        <input
          type="text"
          name="location"
          defaultValue={entry?.location}
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">Date</label>
        <input
          type="date"
          name="date"
          defaultValue={entry?.date}
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">Description</label>
        <textarea
          name="description"
          defaultValue={entry?.description}
          rows={4}
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">Images</label>
        <ImageUpload value={images} onChange={setImages} />
        <input type="hidden" name="images" value={JSON.stringify(images)} />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="published"
          id="published"
          defaultChecked={entry?.published ?? false}
          className="rounded border-border"
        />
        <label htmlFor="published" className="text-sm text-[var(--foreground)]">Published</label>
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
        >
          Save
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={() => confirm('Delete this entry?') && deleteTravel(entry.slug)}
            className="rounded-lg border border-red-500 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
          >
            Delete
          </button>
        )}
        <Link href="/admin/travel" className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-hover">
          Cancel
        </Link>
      </div>
    </form>
  );
}
