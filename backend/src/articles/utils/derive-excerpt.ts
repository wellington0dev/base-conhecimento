const EXCERPT_MAX_LENGTH = 160;

export function deriveExcerpt(body: string): string {
  const plainText = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
    .replace(/[#>*_~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (plainText.length <= EXCERPT_MAX_LENGTH) {
    return plainText;
  }

  return `${plainText.slice(0, EXCERPT_MAX_LENGTH).trimEnd()}…`;
}
