'use client';

import { usePathname } from 'next/navigation';
import { Github, Instagram, Linkedin, Link2, Mail, Music } from 'lucide-react';
import type { FooterConfig, FooterSocialType, SizeOption } from '@/lib/types';

const iconSizeClass: Record<SizeOption, string> = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' };
const copyrightSizeClass: Record<SizeOption, string> = { sm: 'text-[10px]', md: 'text-xs', lg: 'text-sm' };

const iconMap = { mail: Mail, linkedin: Linkedin, github: Github, instagram: Instagram, spotify: Music, custom: Link2 };
const labelMap: Record<FooterSocialType, string> = { mail: 'Email', linkedin: 'LinkedIn', github: 'GitHub', instagram: 'Instagram', spotify: 'Spotify' };

const defaultFooter: FooterConfig = {
  socialLinks: [
    { type: 'mail', href: 'mailto:eyupndemirdag@gmail.com' },
    { type: 'linkedin', href: 'https://www.linkedin.com/in/eyupndemirdag/' },
    { type: 'github', href: 'https://github.com/eyupdemirdag' },
    { type: 'instagram', href: 'https://www.instagram.com/eyupdemirdag/' },
    { type: 'spotify', href: 'https://open.spotify.com/user/31z43nwy7g66emdprlo4keb462dy?si=1a5347760ed445bb' },
  ],
  copyrightName: 'Eyup Demirdag',
};

export function Footer({ config, preview }: { config?: FooterConfig | null; preview?: boolean }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin') && !preview) return null;
  const f = config ?? defaultFooter;
  const { socialLinks, copyrightName, iconSize = 'md', copyrightSize = 'md' } = f;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-[var(--surface)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center gap-6">
            {socialLinks.map((link, index) => {
              const type = link.type;
              const href = link.href;
              const Icon = iconMap[type];
              const label = type === 'custom' ? link.label : labelMap[type as FooterSocialType];
              const iconUrl = 'iconUrl' in link ? link.iconUrl : undefined;
              return (
                <a
                  key={`${index}-${type}-${href}`}
                  href={href}
                  {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="text-muted transition-colors hover:text-[var(--foreground)] flex items-center justify-center"
                  aria-label={label}
                >
                  {iconUrl ? (
                    <img src={iconUrl} alt="" className={`object-contain ${iconSizeClass[iconSize]}`} />
                  ) : (
                    <Icon className={iconSizeClass[iconSize]} />
                  )}
                </a>
              );
            })}
          </div>
          <p className={`text-center text-muted ${copyrightSizeClass[copyrightSize]}`}>
            © {currentYear} {copyrightName}
          </p>
        </div>
      </div>
    </footer>
  );
}
