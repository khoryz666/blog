#!/usr/bin/env node
// Regenerates the brand assets that must stay in sync with src/config.ts and
// src/styles/base.css:
//   public/og-cover.png  — default social-preview (og:image) cover
//   public/favicon.svg   — favicon
// Run with: npm run assets
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { site } from '../src/config.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// Colors come from the theme's :root variables, so the assets follow the palette.
const css = await readFile(resolve(root, 'src/styles/base.css'), 'utf8')
const rootBlock = css.match(/:root\s*\{([\s\S]*?)\}/)?.[1] ?? ''
const token = (name, fallback) =>
  rootBlock.match(new RegExp(`${name}\\s*:\\s*([^;]+);`))?.[1]?.trim() ?? fallback

const colors = {
  bg: token('--bg', '#faf6ec'),
  heading: token('--heading', '#2f2a24'),
  muted: token('--muted', '#8d8578'),
  link: token('--link', '#2f6f8f'),
  accent: token('--accent', '#b07d2b'),
}

const escapeXml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

const fontFamily = 'Helvetica, Arial, sans-serif'
const tagline = site.taglines.find((line) => /[A-Za-z]/.test(line)) ?? site.taglines[0] ?? ''
const host = new URL(site.url).host

const cover = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${colors.bg}"/>
  <rect width="1200" height="16" fill="${colors.accent}"/>
  <circle cx="1060" cy="500" r="220" fill="${colors.accent}" opacity="0.12"/>
  <circle cx="150" cy="560" r="90" fill="${colors.link}" opacity="0.10"/>
  <text x="90" y="300" font-family="${fontFamily}" font-size="92" font-weight="700" fill="${colors.heading}">${escapeXml(site.title)}</text>
  <text x="90" y="372" font-family="${fontFamily}" font-size="38" fill="${colors.muted}">${escapeXml(tagline)}</text>
  <text x="90" y="545" font-family="${fontFamily}" font-size="30" fill="${colors.link}">${host}</text>
</svg>`

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${escapeXml(site.brand)}">
  <rect width="64" height="64" rx="14" fill="${colors.accent}"/>
  <text x="32" y="45" font-family="${fontFamily}" font-size="42" font-weight="700" fill="${colors.bg}" text-anchor="middle">h</text>
</svg>
`

const publicDir = resolve(root, 'public')
await mkdir(publicDir, { recursive: true })
await sharp(Buffer.from(cover)).png({ compressionLevel: 9, palette: true }).toFile(resolve(publicDir, 'og-cover.png'))
await writeFile(resolve(publicDir, 'favicon.svg'), favicon)
console.log('wrote public/og-cover.png and public/favicon.svg')
