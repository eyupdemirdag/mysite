import { redirect } from 'next/navigation';
import { BlogForm } from '@/components/admin/BlogForm';
import { isAdmin } from '@/lib/auth';

export default async function NewBlogPage() {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">New blog post</h1>
      <BlogForm />
    </div>
  );
}
