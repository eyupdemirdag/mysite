import { redirect } from 'next/navigation';
import { projects } from '@/lib/data';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { isAdmin } from '@/lib/auth';

export default async function NewProjectPage() {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">New project</h1>
      <ProjectForm />
    </div>
  );
}
