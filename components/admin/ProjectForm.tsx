'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ImageUpload } from './ImageUpload';
import { saveProject, deleteProject } from '@/app/admin/actions/projects';
import type { Project } from '@/lib/types';

type Props = { project?: Project };

export function ProjectForm({ project }: Props) {
  const [images, setImages] = useState<string[]>(project?.images ?? []);
  const [stackStr, setStackStr] = useState(project?.stack?.join(', ') ?? '');
  const isEdit = !!project;

  return (
    <form
      action={saveProject}
      className="mt-6 max-w-2xl space-y-6"
    >
      {isEdit && (
        <input type="hidden" name="slug" value={project.slug} />
      )}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Title *
        </label>
        <input
          type="text"
          name="title"
          defaultValue={project?.title}
          required
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Slug (URL)
        </label>
        <input
          type="text"
          name="slug"
          defaultValue={project?.slug}
          placeholder="my-project"
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
          readOnly={isEdit}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Description
        </label>
        <textarea
          name="description"
          defaultValue={project?.description}
          rows={4}
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Stack (comma-separated)
        </label>
        <input
          type="text"
          value={stackStr}
          onChange={(e) => setStackStr(e.target.value)}
          name="stack"
          placeholder="Next.js, TypeScript"
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Images
        </label>
        <ImageUpload value={images} onChange={setImages} />
        <input type="hidden" name="images" value={JSON.stringify(images)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">
          GitHub link
        </label>
        <input
          type="url"
          name="githubLink"
          defaultValue={project?.githubLink ?? ''}
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Live link
        </label>
        <input
          type="url"
          name="liveLink"
          defaultValue={project?.liveLink ?? ''}
          className="mt-1 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="published"
          id="published"
          defaultChecked={project?.published ?? false}
          className="rounded border-border"
        />
        <label htmlFor="published" className="text-sm text-[var(--foreground)]">
          Published
        </label>
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
            onClick={() => confirm('Delete this project?') && deleteProject(project.slug)}
            className="rounded-lg border border-red-500 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
          >
            Delete
          </button>
        )}
        <Link
          href="/admin/projects"
          className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-hover"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
