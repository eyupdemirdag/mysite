import Link from 'next/link';
import { blog } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Writing and notes.',
};

export default function BlogPage() {
  const posts = blog.getAll();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
        Blog
      </h1>
      <p className="mt-2 text-muted">Occasional writing.</p>
      <ul className="mt-10 space-y-6 border-t border-border pt-8">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <h2 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                {post.title}
              </h2>
              <p className="mt-1 text-sm text-muted">{post.description}</p>
              <time className="mt-1 block text-xs text-muted" dateTime={post.updatedAt}>
                {new Date(post.updatedAt).toLocaleDateString()}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
