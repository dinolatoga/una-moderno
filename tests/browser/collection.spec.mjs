import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const indexes = [
  ['static', '/'],
  ['Tailwind', '/examples/tailwind/'],
  ['Astro', '/astro/'],
];
const authorCopy = 'Dino Latoga created Una Moderno and writes this specimen.';
// One line, the authored two-line title, and a deliberately long title with an unbroken word.
const titles = [
  'Notes',
  'In praise of the commonplace book',
  'A deliberately long recent story title that keeps wrapping, with UnbrokenWordsThatMustStillWrap',
];

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

async function noOverflow(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

for (const [name, path] of indexes) {
  test(`${name}: phone recent stories keep title and metadata as one content-height stack`, async ({
    page,
  }) => {
    for (const width of [320, 390]) {
      for (const scale of ['100%', '200%']) {
        await page.setViewportSize({ width, height: 844 });
        await page.goto(path);
        await page.evaluate(
          ([size, copy]) => {
            document.documentElement.style.fontSize = size;
            document
              .querySelectorAll('.una-recent .una-story h3 a')
              .forEach((link, index) => (link.textContent = copy[index]));
          },
          [scale, titles],
        );
        await settle(page);
        await page
          .locator('.una-recent img')
          .evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
        const rows = await page.locator('.una-recent .una-story').evaluateAll((stories) =>
          stories.map((story) => {
            const rect = (element) => element.getBoundingClientRect();
            const box = rect(story);
            const image = story.querySelector('img');
            const heading = story.querySelector('h3');
            const meta = story.querySelector('.una-meta');
            const range = document.createRange();
            range.selectNodeContents(heading);
            const lines = [...range.getClientRects()];
            const style = getComputedStyle(story);
            return {
              order: [...story.children].map((child) => child.tagName.toLowerCase()),
              story: { top: box.top, bottom: box.bottom, left: box.left, right: box.right },
              image: rect(image).toJSON(),
              heading: rect(heading).toJSON(),
              meta: rect(meta).toJSON(),
              // Text rects measure glyph content areas; count their line boxes instead.
              lineCount: new Set(lines.map((line) => Math.round(line.top))).size,
              lineHeight: Number.parseFloat(getComputedStyle(heading).lineHeight),
              textBottom: Math.max(...lines.map((line) => line.bottom)),
              leading:
                Number.parseFloat(getComputedStyle(heading).lineHeight) -
                Number.parseFloat(getComputedStyle(heading).fontSize),
              rowGap: Number.parseFloat(style.rowGap),
              columnGap: Number.parseFloat(style.columnGap),
              firstTrack: Number.parseFloat(style.gridTemplateRows.split(' ')[0]),
              distribution: [style.alignContent, style.alignItems],
            };
          }),
        );
        expect(rows).toHaveLength(3);
        for (const [index, row] of rows.entries()) {
          const label = `${name} ${width} ${scale} story ${index + 1}`;
          // Reading order and the thumbnail-beside-text arrangement are unchanged.
          expect(row.order, label).toEqual(['a', 'h3', 'p']);
          expect(row.image.right, label).toBeLessThanOrEqual(row.heading.left - row.columnGap + 1);
          expect(Math.abs(row.image.top - row.story.top), label).toBeLessThanOrEqual(1);
          expect(Math.abs(row.heading.top - row.story.top), label).toBeLessThanOrEqual(1);
          // The title box is exactly its text: no fixed, minimum or stretched title row.
          expect(row.lineCount, label).toBeGreaterThan(0);
          expect(Math.abs(row.heading.height - row.lineCount * row.lineHeight), label).toBeLessThan(
            1,
          );
          expect(Math.abs(row.firstTrack - row.heading.height), label).toBeLessThan(1);
          expect(row.distribution, label).toEqual(['normal', 'start']);
          // Metadata follows the title after the small authored gap, never pushed down.
          expect(Math.abs(row.meta.top - row.heading.bottom - row.rowGap), label).toBeLessThan(1);
          expect(row.meta.top - row.textBottom, label).toBeLessThanOrEqual(
            row.rowGap + row.leading / 2 + 1,
          );
          expect(row.rowGap, label).toBeLessThanOrEqual(row.columnGap);
          // Content drives the row height; nothing collides or escapes the row.
          const stack = row.meta.bottom - row.heading.top;
          expect(
            Math.abs(row.story.bottom - row.story.top - Math.max(row.image.height, stack)),
            label,
          ).toBeLessThan(1);
          expect(row.meta.bottom, label).toBeLessThanOrEqual(row.story.bottom + 0.5);
          expect(row.heading.right, label).toBeLessThanOrEqual(row.story.right + 0.5);
          expect(row.meta.right, label).toBeLessThanOrEqual(row.story.right + 0.5);
        }
        for (const [index, row] of rows.slice(1).entries())
          expect(row.story.top, `row ${index + 2} follows row ${index + 1}`).toBeGreaterThan(
            rows[index].story.bottom,
          );
        await noOverflow(page);
      }
    }
  });

  test(`${name}: the about-the-author module joins the open sidebar in reading order`, async ({
    page,
  }) => {
    for (const width of [320, 390, 768, 1280, 1566]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(path);
      await settle(page);
      const modules = page.locator('aside.una-sidebar > .una-module');
      await expect(modules.locator('h2')).toHaveText([
        'in this edition',
        'about the author',
        'topics',
        'reading desk',
        'made to travel',
      ]);
      const author = modules.nth(1);
      await expect(author).toHaveJSProperty('tagName', 'SECTION');
      await expect(author.locator(':scope > *')).toHaveCount(2);
      await expect(author.locator(':scope > p')).toHaveText(authorCopy);
      await expect(author.locator('img, svg, picture, figure, a, button')).toHaveCount(0);
      const surface = await author.evaluate((element) =>
        [element, ...element.querySelectorAll('*')].map((node) => {
          const style = getComputedStyle(node);
          return {
            background: [style.backgroundColor, style.backgroundImage],
            border: ['Top', 'Right', 'Bottom', 'Left'].map((edge) => style[`border${edge}Width`]),
            radius: style.borderRadius,
            shadow: style.boxShadow,
          };
        }),
      );
      for (const layer of surface)
        expect(layer).toEqual({
          background: ['rgba(0, 0, 0, 0)', 'none'],
          border: ['0px', '0px', '0px', '0px'],
          radius: '0px',
          shadow: 'none',
        });
      // Same open-module rhythm as its neighbours: equal heading and paragraph roles.
      const roles = await modules.evaluateAll((sections) =>
        sections.slice(0, 3).map((section) => {
          const heading = getComputedStyle(section.querySelector('h2'));
          return [heading.fontSize, heading.fontWeight, heading.color, section.className];
        }),
      );
      expect(roles[1].slice(0, 3)).toEqual(roles[0].slice(0, 3));
      expect(roles[1][3]).toBe('una-module');
      await expect(author.locator('p')).toHaveCSS('color', 'rgb(71, 40, 26)');
      await expect(author.locator('p')).toHaveCSS('font-size', '16px');
      const main = await page.locator('main').boundingBox();
      const box = await author.boundingBox();
      if (width >= 1280) expect(box.x).toBeGreaterThan(main.x + main.width);
      else expect(box.y).toBeGreaterThan(main.y + main.height);
      const axe = await new AxeBuilder({ page })
        .include('aside.una-sidebar')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(axe.violations.map(({ id, nodes }) => ({ id, nodes: nodes.length }))).toEqual([]);
      await noOverflow(page);
    }
    // Heading levels never skip: one h1, section h2s, story h3s, then sidebar h2s.
    const levels = await page
      .locator('h1, h2, h3, h4, h5, h6')
      .evaluateAll((headings) => headings.map((heading) => Number(heading.tagName[1])));
    expect(levels[0]).toBe(1);
    for (let index = 1; index < levels.length; index++)
      expect(levels[index] - levels[index - 1]).toBeLessThanOrEqual(1);
  });
}

test('the core index template offers the same open author module after its publication note', async ({
  page,
}) => {
  await page.goto(pathToFileURL(resolve('packages/core/templates/index.html')).href);
  const modules = page.locator('aside.una-sidebar > .una-module');
  await expect(modules.locator('h2')).toHaveText(['about this journal', 'about the author']);
  await expect(modules.nth(1).locator('p')).toHaveCount(1);
  await expect(modules.nth(1).locator('img, svg, a')).toHaveCount(0);
});
