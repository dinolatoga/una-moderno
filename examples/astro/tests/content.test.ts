import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { localAssetPath, normalizeStories, normalizeStory } from '../src/content/contract.ts';
import { buildStoryRoutes } from '../src/content/routes.ts';

const fixtures = JSON.parse(
  readFileSync(new URL('../src/content/fixtures.json', import.meta.url), 'utf8'),
);

test('public fixtures normalize, including a story with no optional artwork', () => {
  const stories = normalizeStories(fixtures);
  assert.equal(stories.length, 4);
  const withoutImage = normalizeStory({ ...fixtures[0], image: undefined });
  assert.equal(withoutImage.image, undefined);
  assert.ok(withoutImage.body.length > 5);
});

test('final story routes preserve authored pages and add one image-free demonstration', () => {
  const stories = normalizeStories(fixtures);
  const routes = buildStoryRoutes(stories);
  assert.equal(routes.length, stories.length + 1);
  assert.deepEqual(routes.slice(0, -1), stories);
  assert.deepEqual(
    routes.at(-1),
    normalizeStory({
      ...stories[3],
      slug: 'no-image',
      image: undefined,
    }),
  );
  assert.equal(new Set(routes.map((story) => story.slug)).size, routes.length);
  assert.ok(stories[3].image, 'creating the image-free route must preserve the original artwork');
});

test('an authored no-image slug fails before duplicate static routes can be generated', () => {
  // The generic content contract permits this slug; only the combined route set conflicts.
  const stories = normalizeStories([...fixtures, { ...fixtures[0], slug: 'no-image' }]);
  assert.throws(() => buildStoryRoutes(stories), {
    name: 'TypeError',
    message: 'Duplicate story slug: no-image',
  });
});

test('a missing image-free source produces an explicit fixture error', () => {
  assert.throws(() => buildStoryRoutes(normalizeStories(fixtures.slice(0, 3))), {
    name: 'TypeError',
    message: 'The image-free demonstration requires a fourth editorial story',
  });
});

test('image paths cannot execute code, leave assets/, or call a remote origin', () => {
  for (const path of [
    'javascript:alert(1)',
    'data:image/svg+xml,<svg/>',
    'https://example.com/x.png',
    '//example.com/x.png',
    'assets/../secrets.png',
    'assets/%2e%2e/x.png',
    'assets/\\example.com/x.png',
    'assets/x.svg?query',
    'assets//x.png',
  ])
    assert.throws(() => localAssetPath(path), TypeError, path);
  assert.equal(localAssetPath('assets/connected-web.svg'), 'assets/connected-web.svg');
});

test('slugs and heading ids cannot create routes or duplicate document anchors', () => {
  for (const slug of ['../escape', 'unsafe?query', 'about', 'index', '', 'UPPER'])
    assert.throws(() => normalizeStory({ ...fixtures[0], slug }));
  for (const id of ['main', 'recent', 'unsafe id', '<script>'])
    assert.throws(() =>
      normalizeStory({ ...fixtures[0], body: [{ type: 'heading', id, text: 'Heading' }] }),
    );
  const heading = { type: 'heading', id: 'same', text: 'Heading' };
  assert.throws(() => normalizeStory({ ...fixtures[0], body: [heading, heading] }));
  assert.throws(() => normalizeStories([fixtures[0], fixtures[0]]));
});

test('invalid calendar dates, dimensions, missing fields, and HTML blocks fail at the boundary', () => {
  for (const published of ['2026-02-30', '2026-13-01', 'yesterday', '2026-1-1'])
    assert.throws(() => normalizeStory({ ...fixtures[0], published }));
  for (const width of [0, -1, 1.5, Infinity, '900', 10001])
    assert.throws(() => normalizeStory({ ...fixtures[0], image: { ...fixtures[0].image, width } }));
  assert.throws(() => normalizeStory({ ...fixtures[0], title: ' ' }));
  assert.throws(() =>
    normalizeStory({ ...fixtures[0], body: [{ type: 'html', html: '<script>alert(1)</script>' }] }),
  );
  assert.throws(() => normalizeStory({ ...fixtures[0], body: [] }));
});

test('all supported body block shapes preserve plain text for Astro to escape', () => {
  const text = '<script>alert("sample")</script> & ordinary text';
  const body = [
    { type: 'paragraph', text },
    { type: 'heading', id: 'sample', text },
    { type: 'quote', text },
    { type: 'list', items: [text] },
  ];
  assert.deepEqual(normalizeStory({ ...fixtures[0], body }).body, body);
});
