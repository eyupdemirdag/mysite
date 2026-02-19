'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { href: '/projects', label: 'Projects' },
  { href: '/travel', label: 'Travel' },
  { href: '/music', label: 'Music' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
] as const;

export function Header() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[var(--surface)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center hover:opacity-80" aria-label="Home">
          <Image
            src="/logo.png"
            alt=""
            width={120}
            height={36}
            className="h-9 w-auto object-contain dark:invert-0"
            priority
          />
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname === href || (href !== '/' && pathname?.startsWith(href))
                  ? 'bg-surface-hover text-[var(--foreground)]'
                  : 'text-muted hover:bg-surface-hover hover:text-[var(--foreground)]'
              }`}
            >
              {label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
