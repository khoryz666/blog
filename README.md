# Ember

A warm, eye-friendly blog theme built with [Astro](https://astro.build). Static HTML output, markdown content, full-text search, and light/dark palettes designed to be easy on the eyes.

## Features

- **One config file, one content directory** — site settings live in `src/config.ts`, all text lives in `content/`
- **Markdown posts & pages** — one folder per post/page, images bundled automatically
- **Live search** — client-side full-text search (title, description, tags, body); the index is fetched only on the first keystroke
- **Eye-friendly light/dark mode** — warm paper light theme, soft graphite dark theme; follows your system by default, toggle with the knob in the top-right corner
- **Post list** — title + one-line description per post, grouped by year
- **Tags** — chips on each post and one archive page per tag at `/tags/<tag>/`
- **Post metadata** — reading time, "Updated" date, older/newer navigation
- **SEO & social previews** — canonical URLs, Open Graph/Twitter cards with a generated cover image, article dates, `lastmod` in the sitemap, robots.txt
- **Syndication** — RSS feed at `/rss.xml`
- **Fast & self-contained** — self-hosted variable fonts, no third-party requests
- **Accessible** — reduced-motion support, live search announcements, labelled toggles
- **Sidebar** — collapsible (hamburger), active-page highlight, rotating tagline

## Quick start

```sh
git clone <this-repo> my-blog
cd my-blog
npm install
npm run dev
```

### Toolchain (optional)

Node version is pinned via [Nix flakes](https://nixos.wiki/wiki/Flakes) + [direnv](https://direnv.net/), so you don't have to manage it manually:

```sh
direnv allow   # once per clone; picks up flake.nix and puts node/npm on PATH
```

Without direnv, `nix develop` drops you into the same shell manually. Without Nix at all, just make sure you have Node `>=22.12.0` (see `engines` in `package.json`) and skip this step — everything else works the same.

Then make it yours:

1. **Settings** — edit `src/config.ts`: brand, title, site URL, language, taglines, nav links, social links. That's the only config file (`astro.config.mjs` and `robots.txt` read the URL from it).
2. **Content** — everything you write lives in `content/`:

   ```
   content/
   ├── posts/               ← blog posts
   │   └── my-post/
   │       ├── index.md     ← frontmatter + markdown body
   │       └── screenshot.png
   └── pages/               ← static pages (about, resources, friends, ...)
       └── about/
           └── index.md
   ```

3. **Write a post** — create `content/posts/<slug>/index.md`:

   ```md
   ---
   title: My post
   description: One-line summary (optional; shown in the post list and as the post's lead + meta description)
   date: 2026-08-18
   lastmod: 2026-08-20    # optional: shown as "Updated ..." and in the sitemap
   tags: [astro]          # optional: chips + an archive page per tag
   image: /my-cover.png   # optional: per-post social preview (defaults to /og-cover.png)
   lang: zh               # optional: <html lang> for this post (defaults to site.lang)
   draft: false           # set true to hide it
   ---

   Body in markdown. Put images in the same folder:

   ![screenshot](./screenshot.png)
   ```

4. **Write a page** — create `content/pages/<name>/index.md`; it's served at `/<name>/` with no other setup:

   ```md
   ---
   title: My Page
   docTitle: Page         # optional: text used in <title>, defaults to title
   description: Optional summary for meta tags (defaults to the first paragraph)
   ---

   Body in markdown.
   ```

## Deploy

```sh
npm run build    # outputs static files to dist/
npm run preview  # check the production build locally
```

`dist/` is plain HTML/CSS/JS/images — deployable to any static host.

### Cloudflare Pages

Connect this repo to a Cloudflare Pages project:

- Build command: `npm run build`
- Build output directory: `dist`

Astro is auto-detected as the framework. Every push to `main` rebuilds and deploys automatically — nothing else to configure. The site URL used for canonical links, the sitemap and robots.txt comes from `site.url` in `src/config.ts`, so update it there.

New post? Add a folder → push to git → Cloudflare rebuilds → it's live. Nothing else to do.

## Tech Stack

- [Astro](https://astro.build) — static site build, content collections, native GitHub-flavored markdown
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — sitemap generation (with per-post `lastmod`)
- [@astrojs/rss](https://docs.astro.build/en/guides/integrations-guide/rss/) — RSS feed
- [@fontsource-variable](https://fontsource.org/) — self-hosted Cuprum/Nunito webfonts
- Zod — frontmatter validation (via `astro/zod`)
- TypeScript — checked with `astro check`
- Oxlint — linting
- Nix flakes + direnv — pinned toolchain (optional, see [Toolchain](#toolchain-optional))

## Structure

- `content/posts/` — one folder per post (`index.md` + images)
- `content/pages/` — one folder per static page (`index.md` + images)
- `src/content.config.ts` — post and page collection schemas (Zod)
- `src/config.ts` — site settings (the only configuration file)
- `src/pages/` — `index.astro` (post list + search), `post/[slug].astro`, `tags/[tag].astro`, `[slug].astro` (renders `content/pages`), `posts.json.ts` (search index), `rss.xml.ts`, `robots.txt.ts`, `404.astro`
- `src/layouts/` — `BaseLayout.astro` (shell, sidebar, head meta/OG)
- `src/components/` — PrevNext, Sidebar, SiteHeader, Icon
- `src/lib/` — `posts.ts` (queries + descriptions), `list.ts` (shared list markup for SSR and search), `markdown.ts`, `format.ts`, `icons.ts`
- `src/styles/` — theme CSS (colors are CSS variables in `base.css`; the `Ember` theme supports light/dark via `html[data-theme]`)
- `public/` — favicon and default social cover, regenerated by `npm run assets`
- `scripts/generate-assets.mjs` — rebuilds `public/og-cover.png` + `public/favicon.svg` from `src/config.ts` and the `base.css` palette
- `flake.nix` / `.envrc` — pinned Node toolchain via Nix + direnv

## Commands

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start dev server                         |
| `npm run build`    | Build static site                        |
| `npm run check`    | Type-check with `astro check`            |
| `npm run lint`     | Lint with Oxlint                         |
| `npm run preview`  | Preview production build                 |
| `npm run assets`   | Regenerate the favicon and social cover  |
| `npm test`         | Runs check, lint, and build — what CI runs |

## Credits

Ember is a modified version of [Blackburn](https://github.com/yoshiharuyamashita/blackburn), a theme by Yoshiharu Yamashita. Design inspired by [shawnliu.me](https://shawnliu.me).

## License

[MIT](./LICENSE)
