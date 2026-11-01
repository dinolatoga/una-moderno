import fixtures from './fixtures.json';
import { normalizeStories } from './contract';
import { buildStoryRoutes } from './routes';

// Authored in this public repository. No CMS, unpublished content, or private dependencies.
export const stories = normalizeStories(fixtures);
export const lead = stories[0];
export const recent = stories.slice(1, 4);

// Validate authored and synthetic routes together before Astro can generate paths.
export const storyRoutes = buildStoryRoutes(stories);

export function formattedDate(value: string, compact = false): string {
  return new Intl.DateTimeFormat('en', {
    month: compact ? 'short' : 'long',
    day: 'numeric',
    ...(compact ? {} : { year: 'numeric' }),
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}
