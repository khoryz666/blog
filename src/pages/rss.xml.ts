import type { APIRoute } from 'astro'
import { site } from '../config'
import { escapeHtml } from '../lib/list'
import { getPublishedPosts, postDescription } from '../lib/posts'

export const GET: APIRoute = async (context) => {
  const base = context.site ?? site.url
  const posts = await getPublishedPosts()
  const items = posts.map((post) => {
    const link = escapeHtml(new URL(`/post/${post.id}/`, base).href)
    return `<item><title>${escapeHtml(post.data.title)}</title><link>${link}</link><guid isPermaLink="true">${link}</guid><description>${escapeHtml(postDescription(post))}</description><pubDate>${post.data.date.toUTCString()}</pubDate></item>`
  })
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeHtml(site.title)}</title><description>${escapeHtml(site.taglines[0] ?? '')}</description><link>${escapeHtml(new URL('/', base).href)}</link><language>${site.lang}</language>${items.join('')}</channel></rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
