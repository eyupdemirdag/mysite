import fs from 'fs';
import path from 'path';
import type { Project, TravelEntry, MusicEntry, BlogPost } from './types';

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

const projectsPath = path.join(DATA_DIR, 'projects.json');
const travelPath = path.join(DATA_DIR, 'travel.json');
const musicPath = path.join(DATA_DIR, 'music.json');
const blogPath = path.join(DATA_DIR, 'blog.json');

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
