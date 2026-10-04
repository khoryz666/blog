import { getCollection } from 'astro:content'
import type { CollectionEntry } from 'astro:content'
import { excerpt } from './markdown'
import { formatDate } from './format'
import type { ListRow } from './list'

export type Post = CollectionEntry<'posts'>

/** Frontmatter description, falling back to the first paragraph of the body. */
export function postDescription(post: Post): string {
  return post.data.description || excerpt(post.body ?? '')
}

/** Maps posts to the flat rows rendered by the post list (see lib/list). */
export function toListRows(posts: Post[]): ListRow[] {
  return posts.map((post) => ({
    slug: post.id,
    title: post.data.title,
    description: postDescription(post),
    date: formatDate(post.data.date),
    year: post.data.date.getFullYear(),
  }))
}

export function sortByDateDesc(posts: Post[]): Post[] {
  return posts.sort((a, b) => (a.data.date < b.data.date ? 1 : -1))
}

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts')
  return sortByDateDesc(posts.filter((post) => !post.data.draft))
}
