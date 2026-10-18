export interface MdSection {
  title: string;
  body: string;
}

function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/** Split a markdown document on `## ` headings, keeping text before the first heading. */
export function splitMarkdownSections(markdown: string): MdSection[] {
  const lines = markdown.split("\n");
  const sections: MdSection[] = [];
  let current: MdSection | null = null;
  const lead: string[] = [];

  for (const line of lines) {
    const heading = /^##\s+(.+?)\s*$/.exec(line);
    if (heading) {
      if (current) sections.push(current);
      current = { title: heading[1] ?? "", body: "" };
    } else if (current) {
      current.body += `${line}\n`;
    } else {
      lead.push(line);
    }
  }
  if (current) sections.push(current);

  const leadText = lead.join("\n").trim();
  const first = sections[0];
  if (leadText && first) {
    sections[0] = { title: first.title, body: `${leadText}\n\n${first.body.trim()}`.trim() };
  }
  return sections.map((s) => ({ title: s.title, body: s.body.trim() }));
}

/**
 * Align model output sections onto the expected structure. Sections not
 * covered by the expected titles are preserved; a document with no headings
 * at all falls back to one generic section so nothing is lost or faked.
 */
export function alignMarkdownSections(markdown: string, expectedTitles: string[]): MdSection[] {
  const found = splitMarkdownSections(markdown);
  if (found.length === 0) {
    return markdown.trim() ? [{ title: expectedTitles[0] ?? "Analysis", body: markdown.trim() }] : [];
  }

  const expectedNormalized = expectedTitles.map(normalizeTitle);
  const consumed = new Set<number>();
  const result: Array<MdSection | null> = expectedTitles.map(() => null);

  for (const section of found) {
    const normalized = normalizeTitle(section.title);
    const index = expectedNormalized.findIndex((expected, i) => {
      if (consumed.has(i)) return false;
      return expected === normalized || expected.startsWith(normalized) || normalized.startsWith(expected);
    });
    if (index >= 0) {
      result[index] = section;
      consumed.add(index);
    } else {
      result.push(section); // unexpected extra section — keep it
    }
  }

  // Stand-ins so the UI keeps its six slots even when the model skipped one.
  const filled: MdSection[] = result.map((section, i) => section ?? { title: expectedTitles[i] ?? "", body: "" });
  const hasContent = filled.some((s) => s.body.length > 0);
  return hasContent ? filled : [{ title: "Analysis", body: markdown.trim() }];
}
