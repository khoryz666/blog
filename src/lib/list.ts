/** One row of the post list, in the shape shared by SSR and client search. */
export interface ListRow {
  slug: string
  title: string
  description: string
  date: string
  year: number
}

export function slugifyTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-')
}

const escapeHtml = (text: string): string =>
  text.replace(/[&<>"']/g, (char) =>
    char === '&'
      ? '&amp;'
      : char === '<'
        ? '&lt;'
        : char === '>'
          ? '&gt;'
          : char === '"'
            ? '&quot;'
            : '&#39;',
  )

const rowHtml = (post: ListRow): string => `
  <li>
    <a class="post-link" href="/post/${post.slug}/">
      <span class="post-main">
        <span class="post-title">${escapeHtml(post.title)}</span>
        ${post.description ? `<span class="post-description">${escapeHtml(post.description)}</span>` : ''}
      </span>
      <time class="post-date">${escapeHtml(post.date)}</time>
    </a>
  </li>`

/** The post list HTML, grouped by year. Used by SSR and by live search. */
export function listHtml(rows: ListRow[]): string {
  const byYear = new Map<number, ListRow[]>()
  for (const row of rows) {
    const group = byYear.get(row.year) ?? []
    group.push(row)
    byYear.set(row.year, group)
  }
  return [...byYear.entries()]
    .map(
      ([year, posts]) => `
  <section class="post-group">
    <h2 class="post-year">${year}</h2>
    <ul class="post-list">${posts.map(rowHtml).join('')}</ul>
  </section>`,
    )
    .join('')
}
