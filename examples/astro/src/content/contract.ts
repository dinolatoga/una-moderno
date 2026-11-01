/** The adapter contract. Values are plain text; the renderer never accepts HTML. */
export type BodyBlock =
  | { type: 'paragraph' | 'quote'; text: string }
  | { type: 'heading'; id: string; text: string }
  | { type: 'list'; items: string[] };

export interface EditorialStory {
  slug: string;
  title: string;
  summary: string;
  author: string;
  published: string;
  category: string;
  image?: { src: string; alt: string; width: number; height: number };
  body: BodyBlock[];
}

function record(value: unknown, field: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new TypeError(`${field} must be an object`);
  }
  return value as Record<string, unknown>;
}

function text(value: unknown, field: string, allowEmpty = false): string {
  if (typeof value !== 'string' || (!allowEmpty && !value.trim())) {
    throw new TypeError(`${field} must be ${allowEmpty ? 'a' : 'a nonempty'} string`);
  }
  return value;
}

function identifier(value: unknown, field: string): string {
  const result = text(value, field);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result)) {
    throw new TypeError(`${field} must be a lowercase, hyphen-separated identifier`);
  }
  return result;
}

function dimension(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0 || value > 10000) {
    throw new TypeError(`${field} must be an integer between 1 and 10000`);
  }
  return value;
}

/** This fixture renderer accepts local assets only; remote media needs an explicit adapter. */
export function localAssetPath(value: unknown): string {
  const path = text(value, 'image.src');
  if (
    !/^assets\/[a-z0-9][a-z0-9._/-]*\.(?:svg|png|jpe?g|webp|avif)$/.test(path) ||
    path.split('/').some((segment) => !segment || segment === '.' || segment === '..')
  ) {
    throw new TypeError('image.src must be a safe relative path inside assets/');
  }
  return path;
}

export function normalizeStory(input: unknown): EditorialStory {
  const source = record(input, 'story');
  const published = text(source.published, 'published');
  const date = new Date(`${published}T00:00:00.000Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(published) ||
    Number.isNaN(date.valueOf()) ||
    date.toISOString().slice(0, 10) !== published
  ) {
    throw new TypeError('published must be a valid ISO calendar date (YYYY-MM-DD)');
  }
  if (!Array.isArray(source.body) || !source.body.length) {
    throw new TypeError('body must contain at least one typed block');
  }
  const headingIds = new Set(['main', 'recent']);
  const body: BodyBlock[] = source.body.map((value: unknown) => {
    const block = record(value, 'body block');
    if (block.type === 'paragraph' || block.type === 'quote') {
      return { type: block.type, text: text(block.text, 'block.text') };
    }
    if (block.type === 'heading') {
      const id = identifier(block.id, 'heading.id');
      if (headingIds.has(id)) throw new TypeError(`Duplicate or reserved heading id: ${id}`);
      headingIds.add(id);
      return { type: 'heading', id, text: text(block.text, 'heading.text') };
    }
    if (block.type === 'list' && Array.isArray(block.items) && block.items.length) {
      return { type: 'list', items: block.items.map((item: unknown) => text(item, 'list item')) };
    }
    throw new TypeError('Unsupported body block; expected paragraph, heading, list, or quote');
  });
  const story: EditorialStory = {
    slug: identifier(source.slug, 'slug'),
    title: text(source.title, 'title'),
    summary: text(source.summary, 'summary'),
    author: text(source.author, 'author'),
    published,
    category: text(source.category, 'category'),
    body,
  };
  if (story.slug === 'about' || story.slug === 'index') {
    throw new TypeError(`Reserved page slug: ${story.slug}`);
  }
  if (source.image !== undefined) {
    const image = record(source.image, 'image');
    story.image = {
      src: localAssetPath(image.src),
      alt: text(image.alt, 'image.alt', true),
      width: dimension(image.width, 'image.width'),
      height: dimension(image.height, 'image.height'),
    };
  }
  return story;
}

export function normalizeStories(input: unknown): EditorialStory[] {
  if (!Array.isArray(input) || !input.length)
    throw new TypeError('stories must be a nonempty array');
  const stories = input.map(normalizeStory);
  const slugs = new Set<string>();
  for (const story of stories) {
    if (slugs.has(story.slug)) throw new TypeError(`Duplicate story slug: ${story.slug}`);
    slugs.add(story.slug);
  }
  return stories;
}
