import type { APIRoute } from 'astro'
import { getPublishedPosts } from '../lib/posts'
import { plainText } from '../lib/markdown'
import { formatDate } from '../lib/format'

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts()
  const index = posts.map((post) => ({
    slug: post.id,
    title: post.data.title,
    date: formatDate(post.data.date),
    year: post.data.date.getFullYear(),
    description: post.data.description ?? '',
    tags: post.data.tags,
    body: plainText(post.body ?? ''),
  }))
  return Response.json(index)
}
