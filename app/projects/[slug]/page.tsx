import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects } from '@/lib/data';
import type { Metadata } from 'next';
import { ExternalLink, Github } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.getBySlug(slug);
  if (!project) return { title: 'Project not found' };
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.getBySlug(slug);
  if (!project || !project.published) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/projects"
        className="text-sm text-muted hover:text-[var(--foreground)]"
      >
        ← Projects
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--foreground)]">
        {project.title}
      </h1>
      {project.stack.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded bg-surface-hover px-2.5 py-1 text-sm text-muted"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
      <p className="mt-6 text-[var(--foreground)]/90">{project.description}</p>
      {project.images.length > 0 && (
        <div className="mt-8 space-y-4">
          {project.images.map((src, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-border">
              <img
                src={src}
                alt={`${project.title} screenshot ${i + 1}`}
                className="w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 flex flex-wrap gap-4">
        {project.githubLink && (
          <a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-hover"
          >
            <Github className="h-4 w-4" /> GitHub
          </a>
        )}
        {project.liveLink && (
          <a
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
          >
            <ExternalLink className="h-4 w-4" /> Live site
          </a>
        )}
      </div>
    </div>
  );
}
