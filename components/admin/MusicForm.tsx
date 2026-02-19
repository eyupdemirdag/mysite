'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ImageUpload } from './ImageUpload';
import { saveMusic, deleteMusic } from '@/app/admin/actions/music';
import type { MusicEntry } from '@/lib/types';

type Props = { entry?: MusicEntry };

export function MusicForm({ entry }: Props) {
  const [cover, setCover] = useState<string[]>(entry?.coverImage ? [entry.coverImage] : []);
  const isEdit = !!entry;

  return (
    <form action={saveMusic} className="mt-6 max-w-2xl space-y-6">
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
          placeholder="my-playlist"
          readOnly={isEdit}
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">Artist</label>
        <input
          type="text"
          name="artist"
          defaultValue={entry?.artist ?? ''}
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">Description</label>
        <textarea
          name="description"
          defaultValue={entry?.description}
          rows={3}
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">Cover image</label>
        <ImageUpload value={cover} onChange={setCover} multiple={false} />
        <input type="hidden" name="coverImage" value={JSON.stringify(cover)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">Spotify embed URL</label>
        <input
          type="url"
          name="spotifyEmbedUrl"
          defaultValue={entry?.spotifyEmbedUrl ?? ''}
          placeholder="https://open.spotify.com/embed/album/..."
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        />
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
            onClick={() => confirm('Delete this entry?') && deleteMusic(entry.slug)}
            className="rounded-lg border border-red-500 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
          >
            Delete
          </button>
        )}
        <Link href="/admin/music" className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-hover">
          Cancel
        </Link>
      </div>
    </form>
  );
}
