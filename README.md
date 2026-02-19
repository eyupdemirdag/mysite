# Personal Website

A minimal personal site built with **Next.js 14** (App Router), **TypeScript**, and **Tailwind CSS**. It includes public pages for projects, travel, music, blog, and about—plus a protected admin for content management.

## Features

- **Public**: Projects (card grid + detail), Travel (gallery), Music (with optional Spotify embed), Blog (Markdown), About
- **Admin** (no header link): Login, dashboard, CRUD for all content, image upload, draft/publish
- **UI**: Responsive, dark mode, clean layout, SEO metadata per page

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set admin password**
   Generate a bcrypt hash and add it to `.env.local`:
   ```bash
   node -e "require('bcryptjs').hash('YOUR_PASSWORD', 10).then(h => console.log(h))"
   ```
   Create `.env.local`:
   ```
   ADMIN_PASSWORD_HASH=<paste the hash here>
   ```

3. **Run dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin](http://localhost:3000/admin).

## Scripts

- `npm run dev` — development
- `npm run build` — production build
- `npm run start` — run production server
- `npm run lint` — ESLint

## Structure

- `app/` — App Router pages and layouts
- `components/` — Header, ThemeToggle, admin forms
- `lib/` — data layer, auth, types, Markdown
- `data/` — JSON stores for projects, travel, music, blog (editable via admin)
- `public/uploads/` — uploaded images (create automatically or add to .gitignore)

Admin is protected by cookie-based auth; only `/admin/login` is public. Content is stored in `data/*.json`; use the admin to add or edit.
