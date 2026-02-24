import fs from 'fs';
import path from 'path';
import type { Project, TravelEntry, MusicEntry, BlogPost, PageSection, SiteConfig } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJson<T>(filePath: string): T[] {
  ensureDir(path.dirname(filePath));
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeJson<T>(filePath: string, data: T[]) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function readJsonObject<T>(filePath: string): T | null {
  ensureDir(path.dirname(filePath));
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  } catch {
    return null;
  }
}

function writeJsonObject<T>(filePath: string, data: T) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

const projectsPath = path.join(DATA_DIR, 'projects.json');
const travelPath = path.join(DATA_DIR, 'travel.json');
const musicPath = path.join(DATA_DIR, 'music.json');
const blogPath = path.join(DATA_DIR, 'blog.json');
const pagesDir = path.join(DATA_DIR, 'pages');

export const projects = {
  getAll: (publishedOnly = true): Project[] => {
    const items = readJson<Project>(projectsPath);
    return publishedOnly ? items.filter((p) => p.published) : items;
  },
  getBySlug: (slug: string): Project | undefined => {
    return readJson<Project>(projectsPath).find((p) => p.slug === slug);
  },
  saveAll: (items: Project[]) => writeJson(projectsPath, items),
};

export const travel = {
  getAll: (publishedOnly = true): TravelEntry[] => {
    const items = readJson<TravelEntry>(travelPath);
    return publishedOnly ? items.filter((t) => t.published) : items;
  },
  getBySlug: (slug: string): TravelEntry | undefined => {
    return readJson<TravelEntry>(travelPath).find((t) => t.slug === slug);
  },
  saveAll: (items: TravelEntry[]) => writeJson(travelPath, items),
};

export const music = {
  getAll: (publishedOnly = true): MusicEntry[] => {
    const items = readJson<MusicEntry>(musicPath);
    return publishedOnly ? items.filter((m) => m.published) : items;
  },
  getBySlug: (slug: string): MusicEntry | undefined => {
    return readJson<MusicEntry>(musicPath).find((m) => m.slug === slug);
  },
  saveAll: (items: MusicEntry[]) => writeJson(musicPath, items),
};

export const blog = {
  getAll: (publishedOnly = true): BlogPost[] => {
    const items = readJson<BlogPost>(blogPath);
    return publishedOnly ? items.filter((b) => b.published) : items;
  },
  getBySlug: (slug: string): BlogPost | undefined => {
    return readJson<BlogPost>(blogPath).find((b) => b.slug === slug);
  },
  saveAll: (items: BlogPost[]) => writeJson(blogPath, items),
};

function pageSectionsPath(pageId: string) {
  return path.join(pagesDir, `${pageId}.json`);
}

export const pageSections = {
  get: (pageId: string): PageSection[] => {
    const raw = readJson<PageSection>(pageSectionsPath(pageId));
    return raw.sort((a, b) => a.order - b.order);
  },
  save: (pageId: string, sections: PageSection[]) => {
    writeJson(pageSectionsPath(pageId), sections);
  },
};

const defaultSiteConfig: SiteConfig = {
  header: {
    name: 'Eyup Demirdag',
    navItems: [
      { href: '/projects', label: 'Projects' },
      { href: '/travel', label: 'Travel' },
      { href: '/music', label: 'Music' },
      { href: '/blog', label: 'Blog' },
      { href: '/about', label: 'About' },
    ],
  },
  footer: {
    socialLinks: [
      { type: 'mail', href: 'mailto:eyupndemirdag@gmail.com' },
      { type: 'linkedin', href: 'https://www.linkedin.com/in/eyupndemirdag/' },
      { type: 'github', href: 'https://github.com/eyupdemirdag' },
      { type: 'instagram', href: 'https://www.instagram.com/eyupdemirdag/' },
      { type: 'spotify', href: 'https://open.spotify.com/user/31z43nwy7g66emdprlo4keb462dy?si=1a5347760ed445bb' },
    ],
    copyrightName: 'Eyup Demirdag',
  },
};

const siteConfigPath = path.join(DATA_DIR, 'site.json');

export const siteConfig = {
  get: (): SiteConfig => {
    const raw = readJsonObject<SiteConfig>(siteConfigPath);
    if (!raw?.header?.navItems?.length) return defaultSiteConfig;
    return {
      header: {
        name: raw.header.name ?? defaultSiteConfig.header.name,
        navItems: raw.header.navItems,
        nameSize: raw.header.nameSize,
        navSize: raw.header.navSize,
        logoUrl: raw.header.logoUrl,
      },
      footer: {
        socialLinks: raw.footer?.socialLinks?.length ? raw.footer.socialLinks : defaultSiteConfig.footer.socialLinks,
        copyrightName: raw.footer?.copyrightName ?? defaultSiteConfig.footer.copyrightName,
        iconSize: raw.footer?.iconSize,
        copyrightSize: raw.footer?.copyrightSize,
      },
    };
  },
  save: (config: SiteConfig) => writeJsonObject(siteConfigPath, config),
};
