# Ember

A warm, eye-friendly blog theme built with [Astro](https://astro.build). Static HTML output, markdown content, full-text search, and light/dark palettes designed to be easy on the eyes.

## Features

- **One config file, one content directory** — site settings live in `src/config.ts`, all text lives in `content/`
- **Markdown posts & pages** — one folder per post/page, images bundled automatically
- **Live search** — client-side full-text search (title, description, tags, body), no server needed
- **Eye-friendly light/dark mode** — warm paper light theme, soft graphite dark theme; follows your system by default, toggle with the knob in the top-right corner
- **Post list** — one clean line per post, grouped by year
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

1. **Settings** — edit `src/config.ts`: brand, title, taglines, nav links, social links. That's the only config file.
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
   description: One-line summary (optional)
   date: 2026-08-18
   tags: [astro]
   draft: false            # set true to hide it
   ---

   Body in markdown. Put images in the same folder:

   ![screenshot](./screenshot.png)
   ```

4. **Write a page** — create `content/pages/<name>/index.md`; it's served at `/<name>/` with no other setup:

   ```md
   ---
   title: My Page
   docTitle: Page         # optional: text used in <title>, defaults to title
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

Astro is auto-detected as the framework. Every push to `main` rebuilds and deploys automatically — nothing else to configure. Optionally set `site` in `astro.config.mjs` to your Pages URL for canonical links.

New post? Add a folder → push to git → Cloudflare rebuilds → it's live. Nothing else to do.

## Tech Stack

- [Astro](https://astro.build) — static site build, content collections
- [remark-gfm](https://github.com/remarkjs/remark-gfm) — GitHub-flavored markdown rendering
- Zod — frontmatter validation (via `astro:content`)
- TypeScript — checked with `astro check`
- Oxlint — linting
- Nix flakes + direnv — pinned toolchain (optional, see [Toolchain](#toolchain-optional))

## Structure

- `content/posts/` — one folder per post (`index.md` + images)
- `content/pages/` — one folder per static page (`index.md` + images)
- `src/content.config.ts` — post and page collection schemas (Zod)
- `src/config.ts` — site settings (the only configuration file)
- `src/pages/` — `index.astro` (post list + search), `post/[slug].astro`, `[slug].astro` (renders `content/pages`), `posts.json.ts` (search index), `404.astro`
- `src/layouts/` — `BaseLayout.astro` (shell, sidebar, head meta/OG)
- `src/components/` — PrevNext, Sidebar, SiteHeader, Icon
- `src/styles/` — theme CSS (colors are CSS variables in `base.css`; the `Ember` theme supports light/dark via `html[data-theme]`)
- `flake.nix` / `.envrc` — pinned Node toolchain via Nix + direnv

## Commands

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start dev server             |
| `npm run build`   | Build static site            |
| `npm run check`   | Type-check with `astro check` |
| `npm run lint`    | Lint with Oxlint             |
| `npm run preview` | Preview production build     |
| `npm run verify:sidebar` | Build + check sidebar layout/footer in mobile & desktop viewports (headless Chromium) |

## Credits

Ember is a modified version of [Blackburn](https://github.com/yoshiharuyamashita/blackburn), a theme by Yoshiharu Yamashita. Design inspired by [shawnliu.me](https://shawnliu.me).

## License

[MIT](./LICENSE)
