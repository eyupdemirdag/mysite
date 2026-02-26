export interface Project {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  images: string[];
  githubLink?: string;
  liveLink?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TravelEntry {
  slug: string;
  title: string;
  description: string;
  location: string;
  images: string[];
  date: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MusicEntry {
  slug: string;
  title: string;
  description: string;
  artist?: string;
  spotifyEmbedUrl?: string;
  coverImage?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PageSectionType = 'hero' | 'text' | 'linkGrid' | 'spacer';

export interface PageSectionBase {
  id: string;
  type: PageSectionType;
  order: number;
}

export interface HeroSection extends PageSectionBase {
  type: 'hero';
  title: string;
  subtitle?: string;
}

export interface TextSection extends PageSectionBase {
  type: 'text';
  heading?: string;
  body: string;
}

export interface LinkGridSection extends PageSectionBase {
  type: 'linkGrid';
  title?: string;
  links: { label: string; href: string }[];
}

export interface SpacerSection extends PageSectionBase {
  type: 'spacer';
  height: 'sm' | 'md' | 'lg';
}

export type PageSection =
  | HeroSection
  | TextSection
  | LinkGridSection
  | SpacerSection;

export type SizeOption = 'sm' | 'md' | 'lg';

export type HeaderAlignOption = 'left' | 'center' | 'right';

export type BrandOrderOption = 'logo-name' | 'name-logo';

export interface HeaderConfig {
  name: string;
  navItems: { href: string; label: string }[];
  nameSize?: SizeOption;
  navSize?: SizeOption;
  logoUrl?: string;
  /** Logo + name block alignment */
  headerAlign?: HeaderAlignOption;
  /** Navigation bar alignment */
  navAlign?: HeaderAlignOption;
  /** Order of logo and name in header (drag to swap in admin) */
  brandOrder?: BrandOrderOption;
}

export type FooterSocialType = 'mail' | 'linkedin' | 'github' | 'instagram' | 'spotify';

export type FooterSocialLink =
  | { type: FooterSocialType; href: string; iconUrl?: string }
  | { type: 'custom'; href: string; label: string; iconUrl?: string };

export type FooterContentOrderOption = 'social-copyright' | 'copyright-social';

export interface FooterConfig {
  socialLinks: FooterSocialLink[];
  copyrightName: string;
  iconSize?: SizeOption;
  copyrightSize?: SizeOption;
  /** Social icons row alignment */
  socialAlign?: HeaderAlignOption;
  /** Copyright row alignment */
  copyrightAlign?: HeaderAlignOption;
  /** Order of social and copyright when stacked (drag to swap in admin) */
  footerContentOrder?: FooterContentOrderOption;
}

export interface CustomPage {
  slug: string;
  title: string;
}

export interface SiteConfig {
  header: HeaderConfig;
  footer: FooterConfig;
  customPages?: CustomPage[];
}
