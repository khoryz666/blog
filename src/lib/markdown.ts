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
