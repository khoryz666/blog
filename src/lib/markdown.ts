export function plainText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~>#]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function excerpt(md: string): string {
  const paragraph = md
    .split(/\n\s*\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith('#') && !line.startsWith('```'))
  if (!paragraph) return ''
  return plainText(paragraph)
}

const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu

/** Rough reading time: ~200 latin words/min, ~400 CJK characters/min. */
export function readingTime(md: string): string {
  const text = md.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ')
  const cjk = text.match(CJK)?.length ?? 0
  const words = text
    .replace(CJK, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 200 + cjk / 400))
  return `${minutes} min read`
}
