'use client';

import Link from 'next/link';
import { saveBlog, deleteBlog } from '@/app/admin/actions/blog';
import type { BlogPost } from '@/lib/types';

type Props = { post?: BlogPost };

export function BlogForm({ post }: Props) {
  const isEdit = !!post;

  return (
    <form action={saveBlog} className="mt-6 max-w-2xl space-y-6">
      {isEdit && <input type="hidden" name="slug" value={post.slug} />}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">Title *</label>
        <input
          type="text"
          name="title"
          defaultValue={post?.title}
          required
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">Slug (URL)</label>
        <input
          type="text"
          name="slug"
          defaultValue={post?.slug}
          placeholder="my-post"
          readOnly={isEdit}
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">Description (excerpt)</label>
        <input
          type="text"
          name="description"
          defaultValue={post?.description}
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">Content (Markdown)</label>
        <textarea
          name="content"
          defaultValue={post?.content}
          rows={16}
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 font-mono text-sm text-[var(--foreground)]"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="published"
          id="published"
          defaultChecked={post?.published ?? false}
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
            onClick={() => confirm('Delete this post?') && deleteBlog(post.slug)}
            className="rounded-lg border border-red-500 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
          >
            Delete
          </button>
        )}
        <Link href="/admin/blog" className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-hover">
          Cancel
        </Link>
      </div>
    </form>
  );
}
