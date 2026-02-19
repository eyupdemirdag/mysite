import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blog } from '@/lib/data';
import { markdownToHtml } from '@/lib/markdown';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blog.getBySlug(slug);
  if (!post) return { title: 'Post not found' };
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blog.getBySlug(slug);
  if (!post || !post.published) notFound();

  const contentHtml = await markdownToHtml(post.content);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/blog"
        className="text-sm text-muted hover:text-[var(--foreground)]"
      >
        ← Blog
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--foreground)]">
        {post.title}
      </h1>
      <time className="mt-2 block text-sm text-muted" dateTime={post.updatedAt}>
        {new Date(post.updatedAt).toLocaleDateString()}
      </time>
      <div
        className="blog-content mt-8 space-y-4 text-[var(--foreground)]/90 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_ul]:list-inside [&_ul]:list-disc [&_ol]:list-inside [&_ol]:list-decimal [&_a]:text-[var(--accent)] [&_a]:underline [&_p]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
