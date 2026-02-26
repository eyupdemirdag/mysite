'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { HeaderConfig, SizeOption, HeaderAlignOption } from '@/lib/types';

const nameSizeClass: Record<SizeOption, string> = { sm: 'text-xs', md: 'text-sm sm:text-base', lg: 'text-base sm:text-lg' };
const navSizeClass: Record<SizeOption, string> = { sm: 'text-xs', md: 'text-xs sm:text-sm', lg: 'text-sm sm:text-base' };
const alignJustifyClass: Record<HeaderAlignOption, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

const defaultHeader: HeaderConfig = {
  name: 'Eyup Demirdag',
  navItems: [
    { href: '/projects', label: 'Projects' },
    { href: '/travel', label: 'Travel' },
    { href: '/music', label: 'Music' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
  ],
};

const SCROLL_THRESHOLD = 60;
const MOBILE_BREAKPOINT = 640;

export function Header({ config, preview }: { config?: HeaderConfig | null; preview?: boolean }) {
  const pathname = usePathname();
  const c = config ?? defaultHeader;
  const { name, navItems, nameSize = 'md', navSize = 'md', logoUrl, headerAlign = 'center', navAlign = 'center', brandOrder = 'logo-name' } = c;
  const hasLogo = Boolean(logoUrl?.trim());
  const hasName = Boolean(name?.trim());
  const showSeparator = hasLogo && hasName;
  const logoSrc = logoUrl?.trim() || '/logo.png';
  const isAdmin = pathname?.startsWith('/admin');
  const isOppositeSides =
    (headerAlign === 'left' && navAlign === 'right') || (headerAlign === 'right' && navAlign === 'left');
  const headerJustify = alignJustifyClass[headerAlign];
  const navJustify = alignJustifyClass[navAlign];
  const [navVisible, setNavVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (preview) return;
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [preview]);

  useEffect(() => {
    if (preview) return;
    const handleScroll = () => {
      const y = window.scrollY;
      if (isMobile) {
        if (y > lastScrollY.current && y > SCROLL_THRESHOLD) setNavVisible(false);
        else if (y < lastScrollY.current) setNavVisible(true);
      } else {
        setNavVisible(true);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, preview]);

  if (isAdmin && !preview) return null;

  const logoEl = hasLogo && (
    <Image
      src={logoSrc}
      alt=""
      width={280}
      height={84}
      className="h-14 w-auto object-contain dark:invert-0 sm:h-20"
      priority
    />
  );
  const nameEl = hasName && (
    <span className={`font-semibold tracking-[0.2em] text-[var(--foreground)] uppercase ${nameSizeClass[nameSize]}`}>
      {name}
    </span>
  );
  const first = brandOrder === 'name-logo' ? nameEl : logoEl;
  const second = brandOrder === 'name-logo' ? logoEl : nameEl;
  const logoNameBlock = (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2 hover:opacity-90 transition-opacity sm:gap-4"
      aria-label="Home"
    >
      {first}
      {showSeparator && (
        <span className="h-8 w-px shrink-0 rounded-full bg-border sm:h-10" aria-hidden />
      )}
      {second}
      {!hasLogo && !hasName && (
        <span className={`font-semibold tracking-[0.2em] text-[var(--foreground)] uppercase ${nameSizeClass[nameSize]}`}>Home</span>
      )}
    </Link>
  );

  const navBlock = (
    <div
      className={`w-full overflow-hidden transition-[max-height,opacity] duration-300 ease-out sm:max-h-none sm:opacity-100 ${
        preview ? 'max-h-14 opacity-100' : isMobile ? (navVisible ? 'max-h-14 opacity-100' : 'max-h-0 opacity-0') : ''
      } ${isOppositeSides ? 'sm:w-auto sm:shrink-0' : ''}`}
    >
      <nav className={`w-full overflow-x-auto overflow-y-hidden py-1 sm:overflow-visible sm:py-0 ${isOppositeSides ? 'sm:w-auto' : ''}`}>
        <div className={`flex min-w-0 flex-nowrap items-center gap-2 sm:flex-wrap sm:gap-6 ${navJustify}`}>
          {navItems.map(({ href, label }) => {
              const isActive =
                pathname === href || (href !== '/' && pathname?.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    relative shrink-0 rounded-lg px-3 py-2 font-medium tracking-wide
                    transition-all duration-200 ease-out
                    sm:min-w-[4.5rem] sm:px-4 sm:py-2.5 sm:text-center
                    hover:-translate-y-0.5 hover:scale-[1.02]
                    active:scale-[0.98]
                    ${navSizeClass[navSize]}
                    ${
                      isActive
                        ? 'text-[var(--foreground)] bg-[var(--surface-hover)] shadow-sm'
                        : 'text-muted hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]/70'
                    }
                  `}
                >
                  {isActive && (
                    <span
                      className="absolute inset-x-2 bottom-1.5 h-0.5 rounded-full bg-[var(--accent)]"
                      aria-hidden
                    />
                  )}
                  <span className="relative whitespace-nowrap">{label}</span>
                </Link>
              );
          })}
        </div>
      </nav>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[var(--surface)]/80 backdrop-blur-md">
      <div className={`mx-auto max-w-5xl py-3 px-4 sm:px-6 sm:py-4 ${isOppositeSides ? 'flex flex-row flex-nowrap items-center justify-between gap-4 sm:gap-6' : 'flex flex-col gap-2 sm:gap-3'}`}>
        {isOppositeSides ? (
          <>
            {headerAlign === 'left' ? logoNameBlock : navBlock}
            {headerAlign === 'left' ? navBlock : logoNameBlock}
          </>
        ) : (
          <>
            <div className={`flex w-full ${headerJustify}`}>{logoNameBlock}</div>
            {navBlock}
          </>
        )}
      </div>
    </header>
  );
}
