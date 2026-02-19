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
