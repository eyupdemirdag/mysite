import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { projects } from '@/lib/data';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { isAdmin } from '@/lib/auth';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const { slug } = await params;
  const project = projects.getBySlug(slug);
  if (!project) notFound();

  return (
    <div className="p-8">
      <Link href="/admin/projects" className="text-sm text-muted hover:underline">
        ← Projects
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-[var(--foreground)]">
        Edit: {project.title}
      </h1>
      <ProjectForm project={project} />
    </div>
  );
}
