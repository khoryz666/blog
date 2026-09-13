import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    lastmod: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
})

const pages = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './content/pages' }),
  schema: z.object({
    title: z.string(),
    docTitle: z.string().optional(),
  }),
})

export const collections = { posts, pages }
