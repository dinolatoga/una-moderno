import { normalizeStories } from './contract.ts';
import type { EditorialStory } from './contract.ts';

/** Add the image-free demonstration route, then validate the complete route namespace. */
export function buildStoryRoutes(stories: readonly EditorialStory[]): EditorialStory[] {
  const imageFreeSource = stories[3];
  if (!imageFreeSource) {
    throw new TypeError('The image-free demonstration requires a fourth editorial story');
  }
  return normalizeStories([...stories, { ...imageFreeSource, slug: 'no-image', image: undefined }]);
}
