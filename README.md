# hongye's Blog

A personal blog built with [Hugo](https://gohugo.io) and the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme. You write posts in Markdown (in Obsidian or any editor), push, and the site rebuilds and deploys itself. Dependencies update themselves every week.

Fork it to start your own blog: follow [Make it yours](#make-it-yours), then [Deploy](#deploy-on-cloudflare-pages).

## Quick start

You need [Nix](https://nixos.org/download/) with flakes enabled. Nix provides Hugo and the theme, so nothing else needs installing.

```sh
git clone git@github.com:<you>/blog.git
cd blog
direnv allow     # or: nix develop
hugo server -D   # http://localhost:1313, drafts included, reloads on save
```

## Make it yours

| What | Where |
| --- | --- |
| Site title, live URL, copyright | top of `hugo.toml` |
| Home page intro | `[params.homeInfoParams]` in `hugo.toml` |
| Social icons | `[[params.socialIcons]]` in `hugo.toml` |
| Top menu | `[[menus.main]]` in `hugo.toml` |
| Default meta description | `description` under `[params]` in `hugo.toml` |
| About, Friends, Resources pages | `content/<name>/index.md` |
| Example posts (delete them) | `content/posts/` |
| Favicon | `static/favicon.svg`, `static/favicon-16x16.png`, `static/favicon-32x32.png`, `static/apple-touch-icon.png` |
| Social preview image | `static/og-cover.png` (1200 × 630) |
| Obsidian Git commit message | `.obsidian/plugins/obsidian-git/data.json` |
| License | `LICENSE` |

The other PaperMod options are in the [PaperMod docs](https://github.com/adityatelange/hugo-PaperMod/wiki). For small style tweaks, create `assets/css/extended/custom.css`. Overriding the theme's layouts works too, but each override is code you then maintain yourself.

## Writing a post

### In Obsidian

1. Open the repo folder itself as a vault (*Open folder as vault*). When Obsidian asks whether to trust the vault, choose *Trust author and enable plugins*. That turns on the bundled Git plugin.
2. Create a folder `content/posts/<slug>/` and a note `index.md` inside it. The post will live at `/post/<slug>/`.
3. Run *Templates: Insert template* and pick one:
   - `post.md` for an essay
   - `post-tldr.md` for a quick note
   - `post-tutorial.md` for a step-by-step guide (comes with a table of contents)
4. Replace `title`, and write. Paste images straight into the note: they are saved next to `index.md` and linked with standard Markdown.
5. When it's ready, change `draft: true` to `draft: false`.
6. Run *Git: Commit-and-sync* (bind it to a hotkey under *Settings → Hotkeys*). It pulls, commits and pushes, and the site deploys within a few minutes.

Commit-and-sync commits *every* change in the repo, so commit other edits separately first.

### In any editor

Create `content/posts/<slug>/index.md`, copy a file from `templates/` into it, fill in `date` as `YYYY-MM-DD`, then preview with `hugo server -D`. To publish, set `draft: false`, commit and push.

### Front matter

```md
---
title: My post
description: One-line summary, shown under the title and as the meta description
date: 2026-08-18
lastmod: 2026-08-20      # optional: when you last changed it a lot
tags: [linux]            # optional: an archive page per tag at /tags/<tag>/
images: [/my-cover.png]  # optional: social preview, relative to static/ (defaults to /og-cover.png)
ShowToc: true            # optional: table of contents
draft: true              # drafts are not published
---

Body in Markdown. Sections use `##`; the title is already the `h1`.

![screenshot](./screenshot.png)
```

A page (`content/<name>/index.md`, served at `/<name>/`) needs only `title`. Add it to the menu in `hugo.toml`.

To keep posts portable to any other blog engine, use standard Markdown only: no Hugo shortcodes and no `![[wikilinks]]`.

## Deploy on Cloudflare Pages

CI builds the site with Nix and uploads it with wrangler. Cloudflare doesn't build anything itself.

1. Create the Pages project from your machine:

   ```sh
   nix develop .#deploy
   wrangler login
   wrangler pages project create <project> --production-branch main
   wrangler whoami   # prints your account ID
   ```

2. In the Cloudflare dashboard, go to *My Profile → API Tokens → Create Token → Custom token*. Give it the permission *Account · Cloudflare Pages · Edit*.
3. In your GitHub repo, go to *Settings → Secrets and variables → Actions*:
   - Under *Secrets*, add `CLOUDFLARE_API_TOKEN` (the token) and `CLOUDFLARE_ACCOUNT_ID`.
   - Under *Variables*, add `CLOUDFLARE_PROJECT` (the project name).
4. Set `baseURL` in `hugo.toml` to `https://<project>.pages.dev/` (or your custom domain), then push. You can also start a deploy by hand from *Actions → CI → Run workflow*.

Until `CLOUDFLARE_PROJECT` is set, CI only builds. To deploy somewhere else, run `nix build` and upload `result/` to any static host.

## Updates

You don't need to do anything for updates:

- **Every week**, `.github/workflows/update.yml` runs `nix flake update`. That bumps Hugo, PaperMod and the Obsidian Git plugin. It then builds the site, and only if the build passes does it push to `main` and deploy.
- **Every month**, Dependabot bumps the GitHub Actions versions, and `dependabot-auto-merge.yml` merges each bump once CI passes.
- **Every push**, CI builds the site. Hugo warnings fail the build, so an update that would break the site stops there and the live site stays as it was.

If a weekly update fails a few times in a row (you'll get an email from GitHub), run this locally:

```sh
nix flake update && nix build -L
```

Then fix what the error names, usually a renamed setting in `hugo.toml`.

In a fork, enable workflows once under the *Actions* tab. GitHub keeps them disabled in forks until you do.

## Commands

| Command | Description |
| --- | --- |
| `hugo server -D` | Preview with drafts at http://localhost:1313 |
| `nix build` | Build the site into `./result` (sees only files tracked by git, so `git add` new files first) |
| `nix flake update` | Update Hugo, PaperMod and the Obsidian Git plugin |
| `nix run .#obsidian-plugins` | Copy the pinned Obsidian Git plugin into `.obsidian/` |

## Structure

```
content/          ← everything you write
├── posts/<slug>/index.md
├── about/ friends/ resources/
├── archives.md   ← the Archive page (no body)
└── search.md     ← the Search page (no body)
templates/        ← Obsidian templates for posts and pages
static/           ← files served as they are: favicons, social preview
hugo.toml         ← site settings
flake.nix         ← dependencies (Hugo, PaperMod, Obsidian Git, wrangler) and the build
.obsidian/        ← vault settings and the Git plugin
.github/          ← CI, deploy, weekly updates
```

## License

[MIT](./LICENSE). PaperMod is MIT-licensed by Aditya Telange.
