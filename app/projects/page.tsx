import Link from 'next/link';
import { projects } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A selection of projects I’ve worked on.',
};

export default function ProjectsPage() {
  const items = projects.getAll();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
        Projects
      </h1>
      <p className="mt-2 text-muted">Things I’ve built or contributed to.</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group rounded-xl border border-border bg-surface p-5 transition-colors hover:border-[var(--accent)]/50 hover:bg-surface-hover"
          >
            {project.images[0] && (
              <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-surface-hover">
                <img
                  src={project.images[0]}
                  alt=""
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <h2 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
              {project.title}
            </h2>
            <p className="mt-1 line-clamp-2 text-sm text-muted">
              {project.description}
            </p>
            {project.stack.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.stack.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="rounded bg-surface-hover px-2 py-0.5 text-xs text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
