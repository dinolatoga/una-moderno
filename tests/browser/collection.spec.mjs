import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const indexes = [
  ['static', '/'],
  ['Tailwind', '/examples/tailwind/'],
  ['Astro', '/astro/'],
];
const authorCopy = 'Dino Latoga created Una Moderno and writes this specimen.';
// The canonical fictional fixtures supply every recent card's text, including its excerpt.
const fixtures = JSON.parse(
  readFileSync(new URL('../../examples/astro/src/content/fixtures.json', import.meta.url), 'utf8'),
);
const recentCards = fixtures.slice(1, 4).map((story, index) => ({
  title: story.title,
  category: story.category,
  published: story.published,
  date: ['Oct 9', 'Oct 6', 'Oct 2'][index],
  excerpt: story.summary,
}));
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

function contrastRatio(foreground, background) {
  const luminance = (color) => {
    const [red, green, blue] = color
      .match(/[\d.]+/g)
      .slice(0, 3)
      .map((value) => {
        const channel = Number(value) / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
    return red * 0.2126 + green * 0.7152 + blue * 0.0722;
  };
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

// Every box a recent card renders, read in one pass so assertions compare one layout.
const readCards = (page) =>
  page.locator('.una-recent > .una-story').evaluateAll((stories) =>
    stories.map((story) => {
      const box = (element) => {
        const rect = element.getBoundingClientRect();
        return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right };
      };
      const lineCount = (element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        return new Set([...range.getClientRects()].map((rect) => Math.round(rect.top))).size;
      };
      const heading = story.querySelector(':scope > h3');
      const meta = story.querySelector(':scope > .una-meta');
      const excerpt = story.querySelector(':scope > .una-excerpt');
      const [category, date] = meta.children;
      const image = story.querySelector('img');
      const text = getComputedStyle(excerpt);
      const surfaces = [story, ...story.querySelectorAll('*')]
        .filter((element) => !element.matches('img'))
        .map((element) => {
          const style = getComputedStyle(element);
          return [
            style.backgroundColor,
            style.backgroundImage,
            style.borderTopWidth,
            style.borderRightWidth,
            style.borderBottomWidth,
            style.borderLeftWidth,
            style.borderRadius,
            style.boxShadow,
          ].join(' ');
        });
      return {
        display: getComputedStyle(story).display,
        distribution: [
          getComputedStyle(story).alignContent,
          getComputedStyle(story).justifyContent,
          getComputedStyle(meta).justifyContent,
        ],
        story: box(story),
        image: image && box(image),
        heading: {
          ...box(heading),
          size: Number.parseFloat(getComputedStyle(heading).fontSize),
          lines: lineCount(heading),
          lineHeight: Number.parseFloat(getComputedStyle(heading).lineHeight),
        },
        headingWeight: Number(getComputedStyle(heading).fontWeight),
        meta: box(meta),
        category: box(category),
        date: box(date),
        metaSize: Number.parseFloat(getComputedStyle(meta).fontSize),
        excerpt: {
          ...box(excerpt),
          lines: lineCount(excerpt),
          lineHeight: Number.parseFloat(text.lineHeight),
          size: Number.parseFloat(text.fontSize),
          weight: Number(text.fontWeight),
          color: text.color,
          clipped:
            excerpt.scrollHeight > excerpt.clientHeight + 1 ||
            excerpt.scrollWidth > excerpt.clientWidth + 1,
          limits: [text.overflow, text.webkitLineClamp, text.maxHeight, text.textOverflow],
        },
        ground: getComputedStyle(document.body).backgroundColor,
        root: Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
        surfaces,
      };
    }),
  );

for (const [name, path] of indexes) {
  test(`${name}: recent cards read title, category, date and excerpt at every width`, async ({
    page,
  }) => {
    for (const scale of ['100%', '200%']) {
      for (const width of [320, 390, 430, 768, 1280, 1566]) {
        const label = `${name} ${width} ${scale}`;
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
        await page.evaluate((size) => (document.documentElement.style.fontSize = size), scale);
        await settle(page);
        // Reading order and text: title, category, date and the fixture summary as excerpt.
        const content = await page.locator('.una-recent > .una-story').evaluateAll((stories) =>
          stories.map((story) => {
            const children = [...story.children].filter((child) => !child.matches('[aria-hidden]'));
            const meta = story.querySelector(':scope > .una-meta');
            return {
              order: children.map(
                (child) => `${child.localName}${child.className ? '.' : ''}${child.className}`,
              ),
              meta: meta ? [...meta.children].map((child) => child.localName) : [],
              title: story.querySelector('h3')?.textContent.trim(),
              category: meta?.querySelector('span')?.textContent.trim(),
              published: meta?.querySelector('time')?.getAttribute('datetime'),
              date: meta?.querySelector('time')?.textContent.trim(),
              excerpt: story.querySelector('.una-excerpt')?.textContent.replace(/\s+/g, ' ').trim(),
            };
          }),
        );
        expect(content, label).toEqual(
          recentCards.map((card) => ({
            order: ['h3', 'p.una-meta', 'p.una-excerpt'],
            meta: ['span', 'time'],
            ...card,
          })),
        );
        const cards = await readCards(page);
        const gap = cards[0].root * 0.5;
        for (const [index, card] of cards.entries()) {
          const story = `${label} story ${index + 1}`;
          // Each title box is exactly its lines: no fixed, minimum or equalized title rows.
          expect(
            Math.abs(
              card.heading.bottom - card.heading.top - card.heading.lines * card.heading.lineHeight,
            ),
            story,
          ).toBeLessThan(1);
          // Category and date stack as one tight left-aligned pair below the title.
          expect(Math.abs(card.meta.top - card.heading.bottom - gap), story).toBeLessThan(1);
          expect(Math.abs(card.date.top - card.category.bottom), story).toBeLessThan(1);
          expect(Math.abs(card.date.left - card.category.left), story).toBeLessThan(1);
          // The excerpt follows the date after the same authored gap, at its natural height.
          expect(Math.abs(card.excerpt.top - card.meta.bottom - gap), story).toBeLessThan(1);
          expect(Math.abs(card.excerpt.top - card.date.bottom - gap), story).toBeLessThan(1);
          expect(card.excerpt.lines, story).toBeGreaterThan(0);
          expect(
            Math.abs(
              card.excerpt.bottom - card.excerpt.top - card.excerpt.lines * card.excerpt.lineHeight,
            ),
            story,
          ).toBeLessThan(1);
          expect(card.excerpt.clipped, story).toBe(false);
          expect(card.excerpt.limits, story).toEqual(['visible', 'none', 'none', 'clip']);
          expect(card.distribution, story).toEqual(['normal', 'normal', 'normal']);
          // Compact and subordinate to the title, yet regular, readable text.
          expect(card.excerpt.size, story).toBeLessThan(card.heading.size);
          expect(card.excerpt.size, story).toBeGreaterThanOrEqual(card.metaSize);
          expect(card.excerpt.weight, story).toBe(400);
          expect(card.excerpt.weight, story).toBeLessThan(card.headingWeight);
          expect(contrastRatio(card.excerpt.color, card.ground), story).toBeGreaterThanOrEqual(4.5);
          // The open layout: no card fields, rules, rounded corners or shadows.
          for (const surface of card.surfaces)
            expect(surface, story).toBe('rgba(0, 0, 0, 0) none 0px 0px 0px 0px 0px none');
          for (const part of ['heading', 'meta', 'excerpt']) {
            expect(card[part].left, `${story} ${part}`).toBeGreaterThanOrEqual(
              card.story.left - 0.5,
            );
            expect(card[part].right, `${story} ${part}`).toBeLessThanOrEqual(
              card.story.right + 0.5,
            );
          }
          expect(card.excerpt.bottom, story).toBeLessThanOrEqual(card.story.bottom + 0.5);
          if (card.display === 'grid') {
            // Phone rows: thumbnail beside the text stack, which starts at the row top.
            expect(Math.abs(card.heading.top - card.story.top), story).toBeLessThanOrEqual(1);
            expect(card.image.right, story).toBeLessThan(card.heading.left);
            if (index) expect(card.story.top, story).toBeGreaterThan(cards[index - 1].story.bottom);
          } else {
            // Three columns: square cover above the text, all cards starting on one line.
            expect(card.image.bottom, story).toBeLessThanOrEqual(card.heading.top);
            expect(Math.abs(card.story.top - cards[0].story.top), story).toBeLessThan(1);
            if (index) expect(card.story.left, story).toBeGreaterThan(cards[index - 1].story.right);
          }
        }
        if (scale === '100%') {
          // Hovering a title changes its color; no card part moves or resizes.
          const title = page.locator('.una-recent > .una-story h3 a').first();
          await title.scrollIntoViewIfNeeded();
          await page.mouse.move(0, 0);
          const before = await readCards(page);
          const rest = await title.evaluate((link) => getComputedStyle(link).color);
          await title.hover();
          await title.evaluate((link) =>
            Promise.all(link.getAnimations().map((animation) => animation.finished)),
          );
          expect(await title.evaluate((link) => getComputedStyle(link).color), label).not.toBe(
            rest,
          );
          expect(await readCards(page), label).toEqual(before);
          await page.mouse.move(0, 0);
        }
        await noOverflow(page);
      }
    }
  });

  test(`${name}: phone recent stories keep title, metadata and excerpt as one content-height stack`, async ({
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
            // The excerpt is optional: the one-line first story drops it, so its taller
            // thumbnail must leave the surplus below the metadata.
            document.querySelector('.una-recent .una-story .una-excerpt').remove();
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
            const excerpt = story.querySelector('.una-excerpt');
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
              excerpt: excerpt && rect(excerpt).toJSON(),
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
              tracks: style.gridTemplateRows.split(' ').length,
              distribution: [style.alignContent, style.alignItems],
            };
          }),
        );
        expect(rows).toHaveLength(3);
        for (const [index, row] of rows.entries()) {
          const label = `${name} ${width} ${scale} story ${index + 1}`;
          // Reading order and the thumbnail-beside-text arrangement are unchanged; a story
          // without an excerpt keeps the two-row title-and-metadata stack.
          expect(row.order, label).toEqual(index ? ['a', 'h3', 'p', 'p'] : ['a', 'h3', 'p']);
          expect(row.tracks, label).toBe(index ? 3 : 2);
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
          if (row.excerpt) {
            // The excerpt follows the metadata after the same gap, beside the thumbnail.
            expect(Math.abs(row.excerpt.top - row.meta.bottom - row.rowGap), label).toBeLessThan(1);
            expect(Math.abs(row.excerpt.left - row.heading.left), label).toBeLessThan(1);
            expect(row.excerpt.right, label).toBeLessThanOrEqual(row.story.right + 0.5);
          }
          // Content drives the row height; nothing collides or escapes the row.
          const last = row.excerpt ?? row.meta;
          const stack = last.bottom - row.heading.top;
          expect(
            Math.abs(row.story.bottom - row.story.top - Math.max(row.image.height, stack)),
            label,
          ).toBeLessThan(1);
          expect(last.bottom, label).toBeLessThanOrEqual(row.story.bottom + 0.5);
          expect(row.heading.right, label).toBeLessThanOrEqual(row.story.right + 0.5);
          expect(row.meta.right, label).toBeLessThanOrEqual(row.story.right + 0.5);
        }
        // At 100% the one-line, excerpt-free story is shorter than its thumbnail, so the
        // surplus case is exercised rather than assumed.
        if (scale === '100%')
          expect(rows[0].meta.bottom - rows[0].heading.top, `${name} ${width}`).toBeLessThan(
            rows[0].image.height - 1,
          );
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

test('the core index template shows the recent card annotation without optional images', async ({
  page,
}) => {
  for (const width of [320, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(pathToFileURL(resolve('packages/core/templates/index.html')).href);
    const stories = page.locator('.una-recent > .una-story');
    await expect(stories).toHaveCount(3);
    for (const story of await stories.all()) {
      await expect(story.locator(':scope > *')).toHaveCount(3);
      await expect(story.locator(':scope > h3 > a')).toHaveCount(1);
      await expect(story.locator(':scope > .una-meta > *')).toHaveCount(2);
      await expect(story.locator(':scope > .una-meta > span + time[datetime]')).toHaveCount(1);
      await expect(story.locator(':scope > .una-meta + .una-excerpt')).toHaveCount(1);
      await expect(story.locator('img, svg')).toHaveCount(0);
      const [meta, excerpt] = await Promise.all(
        ['.una-meta', '.una-excerpt'].map((selector) => story.locator(selector).boundingBox()),
      );
      expect(excerpt.y).toBeGreaterThanOrEqual(meta.y + meta.height);
    }
    await noOverflow(page);
  }
});
