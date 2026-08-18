import { getCollection } from 'astro:content'
import type { CollectionEntry } from 'astro:content'

export type Post = CollectionEntry<'posts'>

export function sortByDateDesc(posts: Post[]): Post[] {
  return posts.sort((a, b) => (a.data.date < b.data.date ? 1 : -1))
}

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts')
  return sortByDateDesc(posts.filter((post) => !post.data.draft))
}
