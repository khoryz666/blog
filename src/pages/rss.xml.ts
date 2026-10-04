import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'
import { site } from '../config'
import { getPublishedPosts, postDescription } from '../lib/posts'

export const GET: APIRoute = async (context) => {
  const posts = await getPublishedPosts()
  return rss({
    title: site.title,
    description: site.taglines[0],
    site: context.site ?? site.title,
    customData: `<language>en</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: postDescription(post),
      pubDate: post.data.date,
      link: `/post/${post.id}/`,
    })),
  })
}
