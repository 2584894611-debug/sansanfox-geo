export function HighlightedText({ text, brandName }: { text: string; brandName: string }) {
  if (!brandName) return <>{text}</>;

  const lower = text.toLowerCase();
  const needle = brandName.toLowerCase();
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  let index = lower.indexOf(needle);

  while (index >= 0) {
    if (index > cursor) parts.push(text.slice(cursor, index));
    parts.push(<mark key={`${index}-${brandName}`}>{text.slice(index, index + brandName.length)}</mark>);
    cursor = index + brandName.length;
    index = lower.indexOf(needle, cursor);
  }

  if (cursor < text.length) parts.push(text.slice(cursor));
  return <>{parts}</>;
}
