import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { blog } from '@/lib/data';
import { BlogForm } from '@/components/admin/BlogForm';
import { isAdmin } from '@/lib/auth';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditBlogPage({ params }: Props) {
  const admin = await isAdmin();
  if (!admin) redirect('/admin/login');
  const { slug } = await params;
  const post = blog.getBySlug(slug);
  if (!post) notFound();

  return (
    <div className="p-8">
      <Link href="/admin/blog" className="text-sm text-muted hover:underline">
        ← Blog
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-[var(--foreground)]">Edit: {post.title}</h1>
      <BlogForm post={post} />
    </div>
  );
}
