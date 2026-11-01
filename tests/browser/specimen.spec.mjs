import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const baseURL = `http://127.0.0.1:${process.env.UNA_TEST_PORT ?? 4321}`;

const widths = [320, 390, 568, 667, 768, 1280, 1440, 1566];
const surfaces = [
  ['static-index', '/'],
  ['static-article', '/article.html'],
  ['tailwind', '/examples/tailwind/'],
  ['astro', '/astro/'],
  ['astro-article', '/astro/a-website-can-be-a-place/'],
];

for (const [name, path] of surfaces) {
  for (const width of widths) {
    test(`${name} at ${width}: layout, assets, landmarks and axe`, async ({ page }) => {
      await page.setViewportSize({
        width,
        height: width === 568 ? 320 : width === 667 ? 375 : width === 1566 ? 1240 : 1000,
      });
      const failures = [];
      page.on('request', (request) => {
        if (
          ['font', 'image'].includes(request.resourceType()) &&
          !request.url().startsWith(`${baseURL}/`) &&
          !request.url().startsWith('data:')
        )
          failures.push(`External asset: ${request.url()}`);
      });
      page.on('pageerror', (error) => failures.push(error.message));
      page.on('response', (response) => {
        if (response.url().startsWith('http://127.0.0.1') && response.status() >= 400)
          failures.push(`${response.status()} ${response.url()}`);
      });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      // Force lazy assets into view before checking completeness and capturing.
      for (const image of await page.locator('img').all()) await image.scrollIntoViewIfNeeded();
      await page
        .locator('img')
        .evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(page.locator('main')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('nav').first()).toHaveAttribute('aria-label', /.+/);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
      expect(
        await page
          .locator('img')
          .evaluateAll((images) =>
            images.every((image) => image.complete && image.naturalWidth > 0),
          ),
      ).toBe(true);
      expect(failures).toEqual([]);
      const axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(
        axe.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
      const box = await page.locator('.una-layout').evaluate((el) => {
        const style = getComputedStyle(el);
        return {
          columns: style.gridTemplateColumns.split(' ').map(parseFloat),
          gap: parseFloat(style.columnGap),
        };
      });
      if (width >= 1280) {
        expect(Math.abs(box.columns[0] / box.columns[1] - 1.618)).toBeLessThan(0.002);
        expect(box.gap).toBeGreaterThanOrEqual(48);
        expect(box.gap).toBeLessThanOrEqual(80);
        expect(box.gap).toBeCloseTo(width / 24, 1);
        const primary = await page.locator('.una-main').boundingBox();
        const sidebar = await page.locator('.una-sidebar > .una-module').first().boundingBox();
        expect(sidebar.x - (primary.x + primary.width)).toBeCloseTo(box.gap, 1);
      } else expect(box.columns).toHaveLength(1);
      if (name.startsWith('static') || [390, 1440, 1566].includes(width)) {
        await mkdir('.impeccable/review', { recursive: true });
        await page.screenshot({
          path: `.impeccable/review/${name}-${width}.png`,
          fullPage: true,
          animations: 'disabled',
        });
      }
    });
  }
}

test('keyboard skip link, ordered headings, article navigation and reduced motion', async ({
  page,
}) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.una-skip-link')).toBeFocused();
  const focus = await page.locator('.una-skip-link').evaluate((el) => ({
    top: el.getBoundingClientRect().top,
    outline: getComputedStyle(el).outlineStyle,
  }));
  expect(focus.top).toBeGreaterThanOrEqual(0);
  expect(focus.outline).toBe('solid');
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.locator('.una-title a').click();
  await expect(page).toHaveURL(/article\.html$/);
  await page
    .getByRole('navigation', { name: 'In this article' })
    .getByRole('link', { name: 'Keep it small enough to care for' })
    .click();
  await expect(page).toHaveURL(/#keep-it-small$/);
  const order = await page
    .locator('h1, h2, h3, h4')
    .evaluateAll((headings) => headings.map((h) => Number(h.tagName.slice(1))));
  expect(order.every((level, i) => !i || level <= order[i - 1] + 1)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await page.locator('#keep-it-small').evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe('0s');
  await expect(page.locator('h1')).toBeVisible();
  const measure = await page.locator('.una-prose').evaluate((el) => {
    const probe = document.createElement('span');
    probe.style.cssText = 'display:block;width:70ch';
    el.append(probe);
    const result = {
      width: el.getBoundingClientRect().width,
      max: probe.getBoundingClientRect().width,
    };
    probe.remove();
    return result;
  });
  expect(measure.width).toBeLessThanOrEqual(measure.max + 1);
});

test('long titles and omitted optional images remain readable at every width', async ({ page }) => {
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.locator('h1 a').evaluate((el) => {
      el.textContent =
        'An extraordinarily long editorial title about a small independent website, its neighbors, and the things we choose to keep — ' +
        'unbrokenword'.repeat(12);
    });
    await page.locator('.una-feature figure').evaluate((el) => el.remove());
    await page
      .locator('.una-story')
      .first()
      .locator('a[aria-hidden]')
      .evaluate((el) => el.remove());
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.una-story h3').first()).toBeVisible();
    if (width === 390)
      expect((await page.locator('.una-story h3').first().boundingBox()).width).toBeGreaterThan(
        180,
      );
  }
});

test('all local specimen links resolve, including fragment targets', async ({ page, request }) => {
  for (const route of [
    '/',
    '/article.html',
    '/blue-hour.html',
    '/commonplace.html',
    '/ordinary.html',
    '/about.html',
    '/artworks.html',
    '/examples/tailwind/',
    '/astro/',
    '/astro/a-website-can-be-a-place/',
    '/astro/no-image/',
  ]) {
    await page.goto(route);
    const links = await page
      .locator('a[href]')
      .evaluateAll((anchors) => [...new Set(anchors.map((a) => a.href))]);
    for (const href of links.filter((url) => url.startsWith(baseURL))) {
      const url = new URL(href);
      const response = await request.get(href);
      expect(response.status(), href).toBe(200);
      if (url.hash)
        expect(await response.text(), href).toContain(
          `id="${decodeURIComponent(url.hash.slice(1))}"`,
        );
    }
  }
});

test('preview only serves intended public files', async ({ request }) => {
  for (const path of [
    '/.env',
    '/package.json',
    '/node_modules/prettier/package.json',
    '/docs/history.md',
    '/assets/%2e%2e/%2e%2e/package.json',
  ]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});

test('native mobile article contents opens and follows a section', async ({ page }) => {
  for (const path of ['/article.html', '/astro/a-website-can-be-a-place/']) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);
    const contents = page.getByRole('navigation', { name: 'Article sections' });
    await contents.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(contents.locator('details')).toHaveAttribute('open', '');
    const first = contents.getByRole('link').first();
    const fragment = await first.getAttribute('href');
    await first.click();
    expect(new URL(page.url()).hash).toBe(fragment);
    await expect(page.locator(fragment)).toBeVisible();
  }
});

test('static HTML works from disk without a server or scripts', async ({ page }) => {
  const { pathToFileURL } = await import('node:url');
  const { resolve } = await import('node:path');
  await page.goto(pathToFileURL(resolve('examples/static-html/index.html')).href);
  await expect(page.locator('h1')).toBeVisible();
  expect(await page.locator('body').evaluate((el) => getComputedStyle(el).color)).toBe(
    'rgb(71, 40, 26)',
  );
  await expect(page.locator('script')).toHaveCount(0);
  await page.locator('.una-title a').click();
  await expect(page).toHaveURL(/article.html$/);
});

test('Tailwind utilities and semantic core respond to the same token override', async ({
  page,
}) => {
  await page.goto('/examples/tailwind/');
  const proof = page.locator('.text-una-ink.font-una-body');
  await expect(proof).toHaveCSS('color', 'rgb(71, 40, 26)');
  await page.locator('html').evaluate((el) => {
    el.style.setProperty('--una-font-body', 'sans-serif');
    el.style.setProperty('--una-color-ink', '#123456');
  });
  await expect(proof).toHaveCSS('font-family', 'sans-serif');
  await expect(page.locator('.una-brand')).toHaveCSS('font-family', 'sans-serif');
  await expect(proof).toHaveCSS('color', 'rgb(18, 52, 86)');
  await expect(page.locator('.una-brand')).toHaveCSS('color', 'rgb(18, 52, 86)');
});

test('Astro renders all public article states with no client scripts', async ({ page }) => {
  for (const route of [
    'a-website-can-be-a-place',
    'blue-hour',
    'commonplace',
    'ordinary',
    'no-image',
  ]) {
    await page.goto(`/astro/${route}/`);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('script')).toHaveCount(0);
    if (route === 'no-image') await expect(page.locator('.una-feature img')).toHaveCount(0);
  }
});

const navigationSurfaces = [
  ['static-index', '/'],
  ['tailwind', '/examples/tailwind/'],
  ['astro', '/astro/'],
];
const navigationViewports = [
  { width: 320, height: 740 },
  { width: 390, height: 844 },
  { width: 568, height: 320 },
  { width: 575, height: 844 },
  { width: 576, height: 844 },
  { width: 577, height: 844 },
  { width: 667, height: 375 },
  { width: 768, height: 1024 },
  { width: 844, height: 390 },
  { width: 1280, height: 1000 },
  { width: 1440, height: 1000 },
  { width: 1566, height: 1240 },
];

const navigation = (page) => {
  const nav = page.locator('nav.una-nav');
  return { nav, links: nav.locator(':scope > a') };
};

async function navigationGeometry(nav) {
  return nav.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    const left = bounds.left + element.clientLeft;
    const top = bounds.top + element.clientTop;
    return {
      left,
      top,
      right: left + element.clientWidth,
      bottom: top + element.clientHeight,
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      scrollLeft: element.scrollLeft,
      links: [...element.querySelectorAll(':scope > a')].map((link) => {
        const box = link.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(link);
        const text = range.getBoundingClientRect();
        return {
          left: box.left,
          right: box.right,
          top: box.top,
          bottom: box.bottom,
          textLeft: text.left,
          textRight: text.right,
        };
      }),
    };
  });
}

async function expectHiddenScrollbar(nav) {
  const scrollbar = await nav.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      standard: style.scrollbarWidth,
      webkit: getComputedStyle(element, '::-webkit-scrollbar').display,
      occupiedHeight:
        element.offsetHeight -
        element.clientHeight -
        Number.parseFloat(style.borderTopWidth) -
        Number.parseFloat(style.borderBottomWidth),
    };
  });
  expect(scrollbar).toEqual({ standard: 'none', webkit: 'none', occupiedHeight: 0 });
}

async function expectUnclippedFocus(nav, link) {
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS('outline-style', 'solid');
  const focus = await link.evaluate((element) => {
    const style = getComputedStyle(element);
    return Number.parseFloat(style.outlineWidth) + Number.parseFloat(style.outlineOffset);
  });
  expect(focus).toBeGreaterThanOrEqual(7);
  await expect
    .poll(async () => {
      const port = await navigationGeometry(nav);
      const box = await link.boundingBox();
      return (
        box.x - focus >= port.left - 1 &&
        box.x + box.width + focus <= port.right + 1 &&
        box.y - focus >= port.top - 1 &&
        box.y + box.height + focus <= port.bottom + 1
      );
    })
    .toBe(true);
}

async function expectNoDocumentOverflow(page) {
  expect(
    await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    })),
  ).toEqual({
    scroll: page.viewportSize().width,
    client: page.viewportSize().width,
  });
}

async function expectAxePass(page) {
  const axe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(
    axe.violations.map(({ id, impact, nodes }) => ({
      id,
      impact,
      targets: nodes.map(({ target }) => target),
    })),
  ).toEqual([]);
}

async function expectRuleFreeSurface(page) {
  const violations = await page.locator('.una, .una *').evaluateAll((elements) =>
    elements.flatMap((element) => {
      // Artwork strokes belong to the image, not the editorial chrome.
      if (!(element instanceof HTMLElement)) return [];
      const label = `${element.tagName.toLowerCase()}.${element.className}`;
      const failures = [];
      for (const pseudo of [null, '::before', '::after']) {
        const style = getComputedStyle(element, pseudo);
        const name = `${label}${pseudo || ''}`;
        for (const edge of ['Top', 'Right', 'Bottom', 'Left']) {
          if (Number.parseFloat(style[`border${edge}Width`]) !== 0)
            failures.push(`${name}: border${edge}=${style[`border${edge}Width`]}`);
        }
        if (style.textDecorationLine !== 'none')
          failures.push(`${name}: text-decoration=${style.textDecorationLine}`);
        if (style.boxShadow !== 'none') failures.push(`${name}: shadow=${style.boxShadow}`);
        const selectedArt = element.matches('body.una[data-una-art]') && pseudo === '::before';
        // Full-box tonal layers cannot draw a rule: the cover's flat hue wash and the
        // parallax shell's paper fade each span their whole element without strokes.
        const box = element.getBoundingClientRect();
        const fullBox =
          pseudo === '::before' &&
          style.position === 'absolute' &&
          style.pointerEvents === 'none' &&
          Number.parseFloat(style.width) >= box.width - 1 &&
          Number.parseFloat(style.height) >= box.height - 1;
        const coverWash =
          fullBox && element.matches('.una-feature--cover') && style.backgroundImage === 'none';
        const shellFade =
          fullBox &&
          element.matches(
            'body.una[data-una-art]:not([data-una-art-effect="static"]) > .una-shell',
          ) &&
          /^linear-gradient\(/.test(style.backgroundImage);
        const layer = selectedArt || coverWash || shellFade;
        if (style.backgroundImage !== 'none' && !layer)
          failures.push(`${name}: background-image=${style.backgroundImage}`);
        if (
          pseudo &&
          style.display !== 'none' &&
          !['none', 'normal'].includes(style.content) &&
          !layer
        )
          failures.push(`${name}: generated content=${style.content}`);
      }
      return failures;
    }),
  );
  expect(violations).toEqual([]);
}

async function expectUndecoratedLink(link) {
  expect(
    await link.evaluate((element) =>
      [null, '::before', '::after'].map((pseudo) => {
        const style = getComputedStyle(element, pseudo);
        return {
          decoration: style.textDecorationLine,
          borders: ['Top', 'Right', 'Bottom', 'Left'].map((edge) =>
            Number.parseFloat(style[`border${edge}Width`]),
          ),
          content: pseudo ? style.content : 'none',
        };
      }),
    ),
  ).toEqual([0, 1, 2].map(() => ({ decoration: 'none', borders: [0, 0, 0, 0], content: 'none' })));
}

async function captureNavigation(page, name, width, state) {
  await page.evaluate(() => document.fonts.ready);
  for (const image of await page.locator('img').all()) await image.scrollIntoViewIfNeeded();
  await page
    .locator('img')
    .evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
  await page.evaluate(() => window.scrollTo(0, 0));
  await mkdir('.impeccable/review', { recursive: true });
  await page.screenshot({
    path: `.impeccable/review/nav-${name}-${width}-${state}.png`,
    fullPage: true,
    animations: 'disabled',
  });
}

async function touchSwipe(session, start, end) {
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ ...start, id: 1 }],
  });
  for (let step = 1; step <= 10; step++) {
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [
        {
          x: start.x + ((end.x - start.x) * step) / 10,
          y: start.y + ((end.y - start.y) * step) / 10,
          id: 1,
        },
      ],
    });
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

test('every shipped page has one direct, script-free navigation link set', async ({ page }) => {
  const { pathToFileURL } = await import('node:url');
  const { resolve } = await import('node:path');
  const routes = [
    '/',
    '/article.html',
    '/blue-hour.html',
    '/commonplace.html',
    '/ordinary.html',
    '/about.html',
    '/examples/tailwind/',
    '/astro/',
    '/astro/a-website-can-be-a-place/',
    '/astro/blue-hour/',
    '/astro/commonplace/',
    '/astro/ordinary/',
    '/astro/about/',
    '/astro/no-image/',
    ...['index.html', 'article.html'].map(
      (name) => pathToFileURL(resolve(`packages/core/templates/${name}`)).href,
    ),
  ];
  for (const route of routes) {
    await page.goto(route);
    const { nav, links } = navigation(page);
    await expect(nav, route).toHaveCount(1);
    await expect(nav, route).toHaveAttribute('aria-label', /.+/);
    await expect(links, route).toHaveText(
      route.startsWith('file:')
        ? ['journal', 'article']
        : ['journal', 'stories', 'long read', 'about'],
    );
    await expect(nav.locator(':scope > :not(a)'), route).toHaveCount(0);
    await expect(page.locator('script'), route).toHaveCount(0);
    if (!route.startsWith('file:')) {
      const brand = page.locator('.una-brand');
      await expect(brand, route).toHaveText('Una Moderno');
      await expect(brand.locator(':scope > span'), route).toHaveText(['Una', 'Moderno']);
    }
    const hrefs = await links.evaluateAll((anchors) => anchors.map((anchor) => anchor.href));
    expect(hrefs.length, route).toBeGreaterThan(0);
    expect(new Set(hrefs).size, route).toBe(hrefs.length);
    expect(await nav.locator('a[aria-current="page"]').count(), route).toBeLessThanOrEqual(1);
    for (const link of await links.all()) await expect(link, route).toHaveAccessibleName(/.+/);
    expect(
      await page.locator('[id]').evaluateAll((elements) => {
        const ids = elements.map((element) => element.id);
        return ids.length === new Set(ids).size;
      }),
      route,
    ).toBe(true);
  }
});

for (const [name, path] of navigationSurfaces) {
  test(`${name}: phone navigation reveals overflow and reaches every link by keyboard`, async ({
    page,
  }) => {
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const { nav, links } = navigation(page);
      const initial = await navigationGeometry(nav);
      expect(initial.scrollLeft).toBe(0);
      expect(initial.scrollWidth).toBeGreaterThan(initial.clientWidth);
      expect(
        initial.links.some(
          (link) => link.textRight > initial.right && initial.right - link.textLeft >= 20,
        ),
        'At least 20px of the next label itself, excluding padding, should reveal continuation.',
      ).toBe(true);
      await expectNoDocumentOverflow(page);
      await expectAxePass(page);
      await captureNavigation(page, name, width, 'initial');
      const masthead = await page.locator('.una-masthead').boundingBox();
      await page.keyboard.press('Tab');
      await expect(page.locator('.una-skip-link')).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(page.locator('.una-brand')).toBeFocused();
      await page.keyboard.press('Tab');
      const allLinks = await links.all();
      for (let index = 0; index < allLinks.length; index++) {
        await expectUnclippedFocus(nav, allLinks[index]);
        if (index < allLinks.length - 1) await page.keyboard.press('Tab');
      }
      const end = await navigationGeometry(nav);
      expect(end.scrollLeft).toBeGreaterThan(0);
      expect(end.scrollLeft + end.clientWidth).toBeGreaterThanOrEqual(end.scrollWidth - 1);
      expect(await page.locator('.una-masthead').boundingBox()).toEqual(masthead);
      await expectNoDocumentOverflow(page);
      await expectAxePass(page);
      await captureNavigation(page, name, width, 'end');
      for (let index = allLinks.length - 2; index >= 0; index--) {
        await page.keyboard.press('Shift+Tab');
        await expectUnclippedFocus(nav, allLinks[index]);
      }
      const wheelTarget = await nav.boundingBox();
      await page.mouse.move(
        wheelTarget.x + wheelTarget.width / 2,
        wheelTarget.y + wheelTarget.height / 2,
      );
      for (let index = 1; index < allLinks.length; index++) await page.keyboard.press('Tab');
      // No pause between keyboard focus and wheel input: focus must not pin native scrolling.
      await page.mouse.wheel(-1000, 0);
      await expect
        .poll(async () => (await navigationGeometry(nav)).scrollLeft)
        .toBeLessThanOrEqual(1);
      await page.keyboard.press('Tab');
      await expect(page.locator('.una-title a')).toBeFocused();
      await links.filter({ hasText: /^long read$/ }).focus();
      const href = await links.filter({ hasText: /^long read$/ }).getAttribute('href');
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(new URL(href, new URL(path, baseURL)).href);
      await expect(page.locator('main h1')).toBeVisible();
    }
  });

  test(`${name}: one navigation row survives phone, landscape, tablet and desktop widths`, async ({
    page,
  }) => {
    for (const viewport of navigationViewports) {
      await page.setViewportSize(viewport);
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const { nav, links } = navigation(page);
      const geometry = await navigationGeometry(nav);
      await expectHiddenScrollbar(nav);
      expect(new Set(geometry.links.map(({ top }) => Math.round(top))).size).toBe(1);
      for (const link of await links.all()) {
        const bounds = await link.boundingBox();
        expect(bounds.height).toBeGreaterThanOrEqual(44);
        expect(bounds.width).toBeGreaterThanOrEqual(44);
      }
      if (viewport.width <= 390) expect(geometry.scrollWidth).toBeGreaterThan(geometry.clientWidth);
      if (viewport.width >= 768) expect(geometry.scrollWidth).toBe(geometry.clientWidth);
      await expectNoDocumentOverflow(page);
    }
  });
}

test('native touch scrolls the navigation horizontally and the page vertically without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    baseURL: baseURL,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    javaScriptEnabled: false,
  });
  const page = await context.newPage();
  const session = await context.newCDPSession(page);
  try {
    for (const [, path] of navigationSurfaces) {
      await page.goto(path);
      const { nav, links } = navigation(page);
      const box = await nav.boundingBox();
      const y = box.y + box.height / 2;
      // Thresholds follow the strip's actual overflow, which depends on label widths.
      const travel = await nav.evaluate((element) => element.scrollWidth - element.clientWidth);
      expect(travel).toBeGreaterThan(16);
      await touchSwipe(session, { x: box.x + box.width - 16, y }, { x: box.x + 16, y });
      await expect
        .poll(async () => (await navigationGeometry(nav)).scrollLeft)
        .toBeGreaterThanOrEqual(travel - 1);
      const last = links.last();
      const href = await last.getAttribute('href');
      await last.tap();
      await expect(page).toHaveURL(new URL(href, new URL(path, baseURL)).href);
      await page.goto(path);
      // Switching from keyboard to touch must not trap the row on the focused link.
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      for (let index = 0; index < (await links.count()); index++) await page.keyboard.press('Tab');
      await expectUnclippedFocus(nav, last);
      const focusedOffset = (await navigationGeometry(nav)).scrollLeft;
      expect(focusedOffset).toBeGreaterThanOrEqual(travel - 1);
      const focusedBox = await nav.boundingBox();
      const focusedY = focusedBox.y + focusedBox.height / 2;
      await touchSwipe(
        session,
        { x: focusedBox.x + 16, y: focusedY },
        { x: focusedBox.x + focusedBox.width - 16, y: focusedY },
      );
      await expect
        .poll(async () => (await navigationGeometry(nav)).scrollLeft)
        .toBeLessThan(focusedOffset / 2);
      // Allow native momentum to settle so transient movement cannot hide a return to focus.
      await page.waitForTimeout(400);
      expect((await navigationGeometry(nav)).scrollLeft).toBeLessThan(focusedOffset / 2);
      await page.goto(path);
      const fresh = await nav.boundingBox();
      const x = fresh.x + fresh.width / 2;
      const startY = fresh.y + fresh.height / 2;
      await touchSwipe(session, { x, y: startY }, { x, y: Math.max(10, startY - 180) });
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(40);
      await expectNoDocumentOverflow(page);
    }
  } finally {
    await session.detach();
    await context.close();
  }
});

test('navigation stays usable with missing fonts, forced colors and reduced motion', async ({
  page,
}) => {
  await page.route('**/*.woff2', (route) => route.abort());
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  for (const [, path] of navigationSurfaces) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const { nav, links } = navigation(page);
    await expect(nav.locator('a[aria-current="page"]')).toHaveCSS('text-decoration-line', 'none');
    await expect(nav.locator('a[aria-current="page"]')).toHaveCSS('font-weight', '600');
    await expect(nav).toHaveCSS('scroll-behavior', 'auto');
    await expectRuleFreeSurface(page);
    await expectHiddenScrollbar(nav);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const allLinks = await links.all();
    for (let index = 0; index < allLinks.length; index++) {
      await expectUnclippedFocus(nav, allLinks[index]);
      if (index < allLinks.length - 1) await page.keyboard.press('Tab');
    }
    await expectNoDocumentOverflow(page);
  }
});

async function platformFonts(page, session, selector) {
  const { root } = await session.send('DOM.getDocument');
  const { nodeId } = await session.send('DOM.querySelector', { nodeId: root.nodeId, selector });
  expect(nodeId, selector).toBeGreaterThan(0);
  const { fonts } = await session.send('CSS.getPlatformFontsForNode', { nodeId });
  return fonts.filter(({ glyphCount }) => glyphCount > 0);
}

// Visible ink edge: the first column whose darkest pixel reaches half the clip's ink depth.
async function inkLeft(page, locator, scale) {
  const box = await locator.boundingBox();
  const clip = { x: Math.max(0, box.x - 24), y: box.y, width: box.width + 48, height: box.height };
  const { data, info } = await sharp(await page.screenshot({ clip }))
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const paper = [255, 254, 250];
  const depth = new Array(info.width).fill(0);
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++)
      for (let channel = 0; channel < 3; channel++)
        depth[x] = Math.max(
          depth[x],
          Math.abs(data[(y * info.width + x) * 3 + channel] - paper[channel]),
        );
  const full = Math.max(...depth);
  return clip.x + depth.findIndex((value) => value >= full / 2) / scale;
}

const alignmentRoutes = [
  ['static-index', '/'],
  ['static-about', '/about.html'],
  ['static-article', '/article.html'],
  ['tailwind', '/examples/tailwind/'],
  ['astro', '/astro/'],
  ['astro-about', '/astro/about/'],
  ['astro-article', '/astro/a-website-can-be-a-place/'],
];

for (const [name, path] of alignmentRoutes) {
  test(`${name}: the first navigation label aligns its ink with the wordmark at every width`, async ({
    browser,
  }) => {
    for (const width of [320, 390, 430, 768, 1280, 1566]) {
      const context = await browser.newContext({
        baseURL,
        viewport: { width, height: 900 },
        deviceScaleFactor: 4,
      });
      const page = await context.newPage();
      try {
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        const wordmark = await inkLeft(page, page.locator('.una-brand span').first(), 4);
        const label = await inkLeft(page, page.locator('.una-nav > a').first(), 4);
        expect(
          Math.abs(label - wordmark),
          `${name} ${width}: label ink at ${label}px, wordmark ink at ${wordmark}px`,
        ).toBeLessThanOrEqual(1);
        // The hit and focus area may extend left of the text, but stays unclipped.
        for (let stop = 0; stop < 3; stop++) await page.keyboard.press('Tab');
        const first = page.locator('.una-nav > a').first();
        await expect(first).toBeFocused();
        expect(
          await first.evaluate((element) => {
            const link = element.getBoundingClientRect();
            const strip = element.parentElement.getBoundingClientRect();
            const style = getComputedStyle(element);
            const reach = parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset);
            return {
              outline: style.outlineStyle,
              insideStrip: link.left - reach >= strip.left - 0.5,
              onScreen: link.left - reach >= 0,
              target: link.height >= 44,
            };
          }),
        ).toEqual({ outline: 'solid', insideStrip: true, onScreen: true, target: true });
        // Phones keep the native, contained scroll strip with hidden chrome.
        if (width <= 430) {
          const { nav } = navigation(page);
          await expect(nav).toHaveCSS('overflow-x', 'auto');
          await expect(nav).toHaveCSS('overscroll-behavior-x', 'contain');
          await expectHiddenScrollbar(nav);
          if (width <= 390)
            expect(await nav.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(
              true,
            );
        }
        await expectNoDocumentOverflow(page);
      } finally {
        await context.close();
      }
    }
  });
}

// The right-edge fade: present while destinations remain, cleared at the end, never
// shown when nothing overflows, and inert for layout, pointer input and focus.
async function navFade(nav) {
  await nav.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
  await nav.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
  return nav.evaluate((element) => {
    const style = getComputedStyle(element);
    const box = element.getBoundingClientRect();
    const band = 2.5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
    // The mask layer is one band wider than the strip; its position moves the transparent
    // end inside (100%) or beyond (0%) the right edge.
    const fade = style.maskImage === 'none' ? 0 : (parseFloat(style.maskPosition) / 100) * band;
    const probe = document.elementFromPoint(box.right - 6, box.top + box.height / 2);
    return {
      scroll: element.scrollLeft,
      max: element.scrollWidth - element.clientWidth,
      fade,
      hit: Boolean(probe?.closest('.una-nav')),
    };
  });
}

test('phone navigation fades at the right edge only while more destinations remain', async ({
  page,
}) => {
  for (const [, path] of [
    ['static-index', '/'],
    ['static-about', '/about.html'],
    ['tailwind', '/examples/tailwind/'],
    ['astro-article', '/astro/a-website-can-be-a-place/'],
  ]) {
    for (const width of [320, 390, 430]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const { nav, links } = navigation(page);
      const start = await navFade(nav);
      if (start.max > 0) expect(start.fade, `${path} ${width} start`).toBeGreaterThan(30);
      else expect(start.fade, `${path} ${width} fits`).toBe(0);
      // Pointer input still reaches the strip and its links beneath the fade.
      expect(start.hit).toBe(true);
      await nav.evaluate((element) => {
        element.scrollLeft = element.scrollWidth;
      });
      const end = await navFade(nav);
      expect(end.scroll).toBe(end.max);
      expect(end.fade, `${path} ${width} end`).toBe(0);
      // The last destination is reachable, focused and unmasked at the end.
      await links.last().focus();
      const last = await navFade(nav);
      expect(last.fade).toBe(0);
      await expectNoDocumentOverflow(page);
    }
  }
  for (const media of [
    { media: 'screen', forcedColors: 'active' },
    { media: 'print', forcedColors: 'none' },
  ]) {
    await page.emulateMedia(media);
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto('/');
    const style = await page
      .locator('.una-nav')
      .evaluate((element) => [
        getComputedStyle(element).maskImage,
        getComputedStyle(element).display,
      ]);
    expect(style[0] === 'none' || style[1] === 'none').toBe(true);
  }
});

test('all font roles and specimen weights render the single local Inter variable face', async ({
  page,
}) => {
  const fontRequests = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'font') fontRequests.push(request.url());
  });
  const session = await page.context().newCDPSession(page);
  await session.send('DOM.enable');
  await session.send('CSS.enable');
  try {
    for (const [, path] of navigationSurfaces) {
      await page.goto(path);
      await page.evaluate(async () => {
        const probe = document.createElement('div');
        probe.className = 'una-prose';
        probe.innerHTML =
          '<p data-font-prose>Editorial prose font check</p><code data-font-code>const journal = true</code>';
        document.querySelector('main').append(probe);
        await Promise.all(
          [200, 300, 400, 500, 600, 700].map((weight) =>
            document.fonts.load(`${weight} 16px Inter`),
          ),
        );
        await document.fonts.ready;
      });
      for (const [selector, weight] of [
        ['.una-deck', '400'],
        ['.una-title a', '300'],
        ['.una-brand', '200'],
        ['.una-nav a:nth-child(2)', '300'],
        ['.una-nav a[aria-current]', '600'],
        ['.una-feature .una-meta span:first-child', '500'],
        ['.una-story:first-child h3 a', '600'],
        ['[data-font-prose]', '400'],
        ['[data-font-code]', '400'],
      ]) {
        await expect(page.locator(selector)).toHaveCSS('font-weight', weight);
        await expect(page.locator(selector)).toHaveCSS('font-optical-sizing', 'auto');
        const family = await page
          .locator(selector)
          .evaluate((element) => getComputedStyle(element).fontFamily);
        expect(family.split(',')[0].replace(/["']/g, '').trim()).toBe('Inter');
        const rendered = await platformFonts(page, session, selector);
        expect(rendered.length, `${path} ${selector}`).toBeGreaterThan(0);
        expect(
          rendered.every((font) => font.familyName === 'Inter Variable' && font.isCustomFont),
        ).toBe(true);
      }
      expect(
        await page.evaluate(() =>
          [...document.fonts]
            .filter((font) => font.family.replace(/["']/g, '') === 'Inter')
            .map(({ weight, style, status }) => ({ weight, style, status })),
        ),
      ).toEqual([{ weight: '100 900', style: 'normal', status: 'loaded' }]);
    }
    expect(fontRequests.length).toBeGreaterThan(0);
    for (const request of fontRequests) {
      const url = new URL(request);
      expect(url.origin).toBe(baseURL);
      expect(url.pathname).toMatch(/inter-variable(?:\.[\w-]+)?\.woff2$/);
    }
  } finally {
    await session.detach();
  }
});

test('slow font loading keeps editorial text and keyboard navigation usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const session = await page.context().newCDPSession(page);
  await session.send('DOM.enable');
  await session.send('CSS.enable');
  try {
    for (const [, path] of navigationSurfaces) {
      let releaseFont;
      let fontRequested = false;
      const pendingFont = new Promise((resolve) => {
        releaseFont = resolve;
      });
      const holdFont = async (route) => {
        fontRequested = true;
        await pendingFont;
        await route.continue();
      };
      await page.route('**/*.woff2', holdFont);
      try {
        await page.goto(path, { waitUntil: 'domcontentloaded' });
        await expect.poll(() => fontRequested).toBe(true);
        expect(
          await page.evaluate(() =>
            [...document.fonts]
              .filter((font) => font.family.replace(/["']/g, '') === 'Inter')
              .map((font) => font.status),
          ),
        ).toEqual(['loading']);
        await expect(page.locator('.una-deck')).toBeVisible();
        const fallback = await platformFonts(page, session, '.una-deck');
        expect(fallback.length).toBeGreaterThan(0);
        expect(fallback.every((font) => font.familyName !== 'Inter Variable')).toBe(true);
        const { nav, links } = navigation(page);
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        const allLinks = await links.all();
        for (let index = 0; index < allLinks.length; index++) {
          await expectUnclippedFocus(nav, allLinks[index]);
          if (index < allLinks.length - 1) await page.keyboard.press('Tab');
        }
        await expectNoDocumentOverflow(page);
        await expectHiddenScrollbar(nav);
        releaseFont();
        await page.evaluate(() => document.fonts.ready);
        const loaded = await platformFonts(page, session, '.una-deck');
        expect(loaded.length).toBeGreaterThan(0);
        expect(
          loaded.every((font) => font.familyName === 'Inter Variable' && font.isCustomFont),
        ).toBe(true);
        await expectNoDocumentOverflow(page);
      } finally {
        releaseFont();
        await page.unrouteAll({ behavior: 'wait' });
      }
    }
  } finally {
    await session.detach();
  }
});

test('200 percent text remains readable without page overflow on phone index and article views', async ({
  page,
}) => {
  for (const width of [320, 390]) {
    for (const [, path] of surfaces) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(path);
      await page.evaluate(async () => {
        document.documentElement.style.fontSize = '200%';
        await document.fonts.ready;
      });
      await expect(page.locator('html')).toHaveCSS('font-size', '32px');
      await expectNoDocumentOverflow(page);
      const masthead = page.locator('.una-brand');
      await expect(masthead).toBeVisible();
      await expect(masthead).toHaveText('Una Moderno');
      const mastheadBounds = await masthead.boundingBox();
      expect(mastheadBounds.x).toBeGreaterThanOrEqual(0);
      expect(mastheadBounds.x + mastheadBounds.width).toBeLessThanOrEqual(width);
      await expect(page.locator('main h1')).toBeVisible();
      const { nav, links } = navigation(page);
      await expectHiddenScrollbar(nav);
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      for (let index = 0; index < (await links.count()); index++) await page.keyboard.press('Tab');
      const last = links.last();
      await expect(last).toBeFocused();
      await expect(last).toHaveCSS('outline-style', 'solid');
      const port = await navigationGeometry(nav);
      const target = await last.boundingBox();
      // An enlarged label can exceed the scrollport; it must remain reachable and operable.
      expect(target.x + target.width).toBeGreaterThan(port.left);
      expect(target.x).toBeLessThan(port.right);
      const destination = new URL(await last.getAttribute('href'), page.url()).href;
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(destination);
    }
  }
});

test('collection indexes share square covers, one feature copy and an unboxed reading pane', async ({
  page,
}) => {
  for (const [, path] of navigationSurfaces) {
    for (const width of [320, 390, 568, 667, 768, 844, 1280, 1440, 1566]) {
      await page.setViewportSize({
        width,
        height: width === 568 || width === 667 || width === 844 ? 390 : 1000,
      });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const feature = page.locator('.una-feature--cover');
      await expect(feature).toHaveCount(1);
      await expect(feature.locator(':scope > .una-feature-copy')).toHaveCount(1);
      await expect(feature.locator(':scope > .una-feature-copy > h1')).toHaveCount(1);
      await expect(feature.locator(':scope > figure')).toHaveCount(1);
      await expect(page.locator('.una-recent > .una-story')).toHaveCount(3);
      await expect(page.locator('#recent')).toHaveText('recent stories');
      await expect(page.locator('.una-section-heading p')).toHaveText('3 stories · newest first');
      for (const image of await page.locator('.una-story img').all()) {
        const bounds = await image.boundingBox();
        expect(bounds.width).toBeCloseTo(bounds.height, 0);
      }
      // The full-cover lead fills its frame edge to edge; its copy stays inside the frame.
      const frame = await feature.boundingBox();
      const lead = await feature.locator('figure img').boundingBox();
      for (const key of ['x', 'y', 'width', 'height']) expect(lead[key]).toBeCloseTo(frame[key], 0);
      const copy = await feature.locator('.una-feature-copy').boundingBox();
      expect(copy.x).toBeGreaterThanOrEqual(frame.x);
      expect(copy.x + copy.width).toBeLessThanOrEqual(frame.x + frame.width + 0.5);
      expect(copy.y + copy.height).toBeLessThanOrEqual(frame.y + frame.height + 0.5);
      await expect(page.locator('.una-module--blue')).toHaveCSS(
        'background-color',
        'rgba(0, 0, 0, 0)',
      );
      await expect(page.locator('.una-module--blue')).toHaveCSS('box-shadow', 'none');
      await expectNoDocumentOverflow(page);
    }
  }
});

test('failed Inter at 200 percent text preserves phone and landscape reading and navigation', async ({
  page,
}) => {
  await page.route('**/*.woff2', (route) => route.abort());
  for (const viewport of [
    { width: 320, height: 844 },
    { width: 390, height: 844 },
    { width: 568, height: 320 },
    { width: 667, height: 375 },
  ]) {
    for (const [, path] of surfaces) {
      await page.setViewportSize(viewport);
      await page.goto(path);
      await page.evaluate(async () => {
        document.documentElement.style.fontSize = '200%';
        await document.fonts.ready;
      });
      expect(
        await page.evaluate(() =>
          [...document.fonts]
            .filter((font) => font.family.replace(/["']/g, '') === 'Inter')
            .map((font) => font.status),
        ),
      ).toEqual(['error']);
      await expect(page.locator('.una-brand')).toBeVisible();
      await expect(page.locator('main h1')).toBeVisible();
      await expectNoDocumentOverflow(page);
      const { nav, links } = navigation(page);
      await expectHiddenScrollbar(nav);
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      for (let index = 0; index < (await links.count()); index++) await page.keyboard.press('Tab');
      await expectUnclippedFocus(nav, links.last());
      const destination = new URL(await links.last().getAttribute('href'), page.url()).href;
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(destination);
    }
  }
});

test('static and Astro about pages expose valid credits and accessible local-only assets', async ({
  page,
}) => {
  for (const [name, path] of [
    ['static-about', '/about.html'],
    ['astro-about', '/astro/about/'],
  ]) {
    for (const width of widths) {
      await page.setViewportSize({
        width,
        height: width === 568 ? 320 : width === 667 ? 375 : width === 1566 ? 1240 : 1000,
      });
      const failures = [];
      const onRequest = (request) => {
        if (
          ['font', 'image'].includes(request.resourceType()) &&
          !request.url().startsWith(`${baseURL}/`) &&
          !request.url().startsWith('data:')
        )
          failures.push(`External asset: ${request.url()}`);
      };
      const onResponse = (response) => {
        if (response.url().startsWith(`${baseURL}/`) && response.status() >= 400)
          failures.push(`${response.status()} ${response.url()}`);
      };
      const onError = (error) => failures.push(error.message);
      page.on('request', onRequest);
      page.on('response', onResponse);
      page.on('pageerror', onError);
      try {
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        await expect(page.locator('main')).toHaveCount(1);
        await expect(page.locator('h1')).toHaveCount(1);
        await expect(page.locator('main')).toContainText('Inter');
        await expect(page.locator('main')).toContainText('unaffiliated with Microsoft');
        await expect(page.locator('a[href="https://rsms.me/inter/"]')).toHaveCount(1);
        await expect(
          page.getByRole('link', { name: 'Read the Zune inspiration and asset policy.' }),
        ).toHaveAttribute(
          'href',
          'https://github.com/dinolatoga/una-moderno/blob/main/docs/zune-inspiration.md',
        );
        await expect(page.locator('.una-nav a[aria-current="page"]')).toHaveText('about');
        const { nav, links } = navigation(page);
        await expect(links).toHaveText(['journal', 'stories', 'long read', 'about']);
        const geometry = await navigationGeometry(nav);
        if (width <= 390) expect(geometry.scrollWidth).toBeGreaterThan(geometry.clientWidth);
        if (width >= 768) expect(geometry.scrollWidth).toBe(geometry.clientWidth);
        await expectNoDocumentOverflow(page);
        await expectAxePass(page);
        expect(failures).toEqual([]);
        await mkdir('.impeccable/review', { recursive: true });
        await page.screenshot({
          path: `.impeccable/review/${name}-${width}.png`,
          fullPage: true,
          animations: 'disabled',
        });
      } finally {
        page.off('request', onRequest);
        page.off('response', onResponse);
        page.off('pageerror', onError);
      }
    }
  }
});

const readingSurfaces = [
  ...surfaces,
  ['static-about', '/about.html'],
  ['astro-about', '/astro/about/'],
];

for (const mode of ['screen', 'forced colors', 'print']) {
  test(`${mode}: editorial chrome uses whitespace without rules or link underlines`, async ({
    page,
  }) => {
    await page.emulateMedia({
      media: mode === 'print' ? 'print' : 'screen',
      forcedColors: mode === 'forced colors' ? 'active' : 'none',
    });
    for (const [, path] of readingSurfaces) {
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        await expectRuleFreeSurface(page);
        if (mode === 'print') {
          const cover = page.locator('.una-feature--cover');
          if (await cover.count()) {
            await expect(cover).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
            await expect(cover).toHaveCSS('color', 'rgb(0, 0, 0)');
            const headline = cover.locator('.una-title a');
            await expect(headline).toHaveCSS('color', 'rgb(0, 0, 0)');
            await headline.hover();
            await expect(headline).toHaveCSS('color', 'rgb(0, 0, 0)');
          }
        }
      }
    }
  });
}

test('links retain a weight cue and no line decoration in every interaction state', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [, path] of readingSurfaces) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    // Check each authored link role, including the dark featured story and prose.
    for (const selector of [
      '.una-brand',
      '.una-nav a:first-child',
      '.una-nav a[aria-current]',
      '.una-title a',
      '.una-story h3 a',
      '.una-link-list a',
      '.una-prose p a',
      '.una-footer a',
    ]) {
      const link = page.locator(selector).first();
      if (!(await link.count()) || !(await link.isVisible())) continue;
      await expectUndecoratedLink(link);
      await link.hover();
      await expectUndecoratedLink(link);
      await page.keyboard.press('Tab');
      await link.focus();
      await expect(link).toHaveCSS('outline-style', 'solid');
      await expect(link).toHaveCSS('outline-width', '3px');
      await expectUndecoratedLink(link);
      await link.hover();
      await page.mouse.down();
      try {
        expect(await link.evaluate((element) => element.matches(':active'))).toBe(true);
        await expectUndecoratedLink(link);
      } finally {
        // Release outside the anchor to avoid navigating during the active-state assertion.
        await page.mouse.move(0, 0);
        await page.mouse.up();
      }
    }
    const destination = page.locator('.una-nav a').last();
    const originalUrl = page.url();
    const href = new URL(await destination.getAttribute('href'), originalUrl).href;
    await page.goto(href);
    await page.goto(originalUrl);
    // Browsers conceal :visited matching/color for privacy; verify the invariant after a real visit.
    await expectUndecoratedLink(page.locator('.una-nav a').last());
    await expectRuleFreeSurface(page);
  }
  for (const path of ['/about.html', '/astro/about/']) {
    await page.goto(path);
    const inline = page.locator('.una-prose p a[href="https://rsms.me/inter/"]');
    await expect(inline.locator('..')).toHaveCSS('font-weight', '400');
    await expect(inline).toHaveCSS('font-weight', '600');
    await expect(inline).toHaveCSS('font-style', 'italic');
    await inline.locator('..').evaluate((paragraph) => {
      const strong = document.createElement('strong');
      strong.dataset.unaEmphasisProof = '';
      strong.textContent = ' Ordinary emphasis';
      paragraph.append(strong);
    });
    const strong = page.locator('[data-una-emphasis-proof]');
    await expect(strong).toHaveCSS('font-weight', '600');
    await expect(strong).toHaveCSS('font-style', 'normal');
    await inline.hover();
    await expect(inline).toHaveCSS('font-weight', '600');
    await expect(inline).toHaveCSS('font-style', 'italic');
    await expectUndecoratedLink(inline);
  }
});

function contrastRatio(foreground, background) {
  const luminance = (color) => {
    const components = color
      .match(/[\d.]+/g)
      .slice(0, 3)
      .map(Number)
      .map((value) => {
        const channel = value / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
    return components[0] * 0.2126 + components[1] * 0.7152 + components[2] * 0.0722;
  };
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

test('desktop lead and navigation hover preserve geometry with distinct readable roles', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const [, path] of navigationSurfaces) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await page.mouse.move(0, 0);
    const headline = page.locator('.una-feature--cover .una-title a');
    // The full cover can start below the fold; settle its position before hover compares it.
    await headline.scrollIntoViewIfNeeded();
    const snapshot = () =>
      page.locator('.una-feature-copy').evaluate((copy) =>
        Object.fromEntries(
          ['.una-title', '.una-deck', '.una-meta'].map((selector) => {
            const rect = copy.querySelector(selector).getBoundingClientRect();
            return [selector, { x: rect.x, y: rect.y, width: rect.width, height: rect.height }];
          }),
        ),
      );
    const initial = await snapshot();
    await expect(headline).toHaveCSS('font-weight', '300');
    await expect(headline).toHaveCSS('color', 'rgb(255, 254, 250)');
    const coverColor = await page
      .locator('.una-feature--cover')
      .evaluate((element) => getComputedStyle(element).backgroundColor);
    expect(
      contrastRatio(
        await headline.evaluate((element) => getComputedStyle(element).color),
        coverColor,
      ),
    ).toBeGreaterThanOrEqual(3);
    await headline.hover();
    // Light rose keeps the hover cue legible on the washed illustration.
    await expect(headline).toHaveCSS('color', 'rgb(244, 198, 204)');
    await expect(headline).toHaveCSS('font-weight', '300');
    expect(await snapshot()).toEqual(initial);
    expect(
      contrastRatio(
        await headline.evaluate((element) => getComputedStyle(element).color),
        coverColor,
      ),
    ).toBeGreaterThanOrEqual(3);
    await page.mouse.down();
    try {
      expect(await headline.evaluate((element) => element.matches(':active'))).toBe(true);
      await expect(headline).toHaveCSS('font-weight', '300');
      expect(await snapshot()).toEqual(initial);
    } finally {
      await page.mouse.move(0, 0);
      await page.mouse.up();
    }
    const { nav, links } = navigation(page);
    const stories = links.filter({ hasText: /^stories$/ });
    await expect(stories).toHaveCSS('color', 'rgb(113, 83, 71)');
    await expect(stories).toHaveCSS('font-weight', '300');
    const paper = await page
      .locator('body')
      .evaluate((element) => getComputedStyle(element).backgroundColor);
    expect(
      contrastRatio(await stories.evaluate((element) => getComputedStyle(element).color), paper),
    ).toBeGreaterThanOrEqual(4.5);
    const navBounds = await navigationGeometry(nav);
    await stories.hover();
    await expect(stories).toHaveCSS('color', 'rgb(155, 101, 107)');
    await expect(stories).toHaveCSS('font-weight', '300');
    expect(await navigationGeometry(nav)).toEqual(navBounds);
    expect(
      contrastRatio(await stories.evaluate((element) => getComputedStyle(element).color), paper),
    ).toBeGreaterThanOrEqual(4.5);
    await page.mouse.down();
    try {
      expect(await stories.evaluate((element) => element.matches(':active'))).toBe(true);
      await expect(stories).toHaveCSS('font-weight', '300');
      expect(await navigationGeometry(nav)).toEqual(navBounds);
    } finally {
      await page.mouse.move(0, 0);
      await page.mouse.up();
    }
    await expect(nav.locator('[aria-current="page"]')).toHaveCSS('font-weight', '600');
    await expect(nav.locator('[aria-current="page"]')).toHaveCSS('color', 'rgb(155, 101, 107)');
    const moduleHeading = page.locator('.una-module--blue h2');
    await expect(moduleHeading).toHaveCSS('color', 'rgb(71, 40, 26)');
    await expect(moduleHeading.locator('a, button')).toHaveCount(0);
    expect(
      contrastRatio(
        await moduleHeading.evaluate((element) => getComputedStyle(element).color),
        paper,
      ),
    ).toBeGreaterThanOrEqual(4.5);
  }
});

test('the spaced wordmark wraps only between whole words on phones and at 200 percent text', async ({
  page,
}) => {
  for (const [, path] of readingSurfaces) {
    for (const width of [320, 390]) {
      for (const scale of ['100%', '200%']) {
        await page.setViewportSize({ width, height: 844 });
        await page.goto(path);
        await page.evaluate(async (fontSize) => {
          document.documentElement.style.fontSize = fontSize;
          await document.fonts.ready;
        }, scale);
        const brand = page.locator('.una-brand');
        await expect(brand).toHaveText('Una Moderno');
        await expect(brand).toHaveAccessibleName('Una Moderno home');
        const words = brand.locator(':scope > span');
        await expect(words).toHaveText(['Una', 'Moderno']);
        const boxes = await words.evaluateAll((spans) =>
          spans.map((span) => {
            const range = document.createRange();
            range.selectNodeContents(span);
            return [...range.getClientRects()].map((rect) => ({
              left: rect.left,
              right: rect.right,
              top: rect.top,
            }));
          }),
        );
        for (const rects of boxes) {
          expect(rects).toHaveLength(1);
          expect(rects[0].left).toBeGreaterThanOrEqual(0);
          expect(rects[0].right).toBeLessThanOrEqual(width);
        }
        // A calmer display scale may keep both words on one line; only splitting is forbidden.
        expect(boxes[1][0].top).toBeGreaterThanOrEqual(boxes[0][0].top);
        if (boxes[1][0].top === boxes[0][0].top)
          expect(boxes[1][0].left).toBeGreaterThan(boxes[0][0].right);
        await expectNoDocumentOverflow(page);
      }
    }
  }
});

test('the removed utility row leaves no markup, text or reserved space on any surface', async ({
  page,
}) => {
  for (const [, path] of readingSurfaces) {
    for (const width of [320, 390, 768, 1280, 1566]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(path);
      await expect(page.locator('.una-utility')).toHaveCount(0);
      await expect(page.locator('body')).not.toContainText(/An independent web journal/i);
      await expect(page.locator('body')).not.toContainText(/Volume 01/i);
      // The masthead is the shell's first child; its own top padding is the only space.
      expect(
        await page.locator('.una-shell').evaluate((shell) => {
          const masthead = shell.firstElementChild;
          return {
            first: masthead.className,
            gap:
              masthead.getBoundingClientRect().top -
              shell.getBoundingClientRect().top -
              Number.parseFloat(getComputedStyle(shell).paddingTop),
          };
        }),
      ).toEqual({ first: 'una-masthead', gap: 0 });
      await expectNoDocumentOverflow(page);
    }
  }
});

test('golden desktop tracks retain a generous gutter and stack with one vertical interval', async ({
  page,
}) => {
  for (const [, path] of surfaces) {
    for (const width of [768, 896, 897, 1280, 1440, 1566]) {
      await page.setViewportSize({ width, height: 1240 });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const geometry = await page.locator('.una-layout').evaluate((layout) => {
        const style = getComputedStyle(layout);
        const primary = layout.querySelector('.una-main').getBoundingClientRect();
        const sidebar = layout.querySelector('.una-sidebar').getBoundingClientRect();
        return {
          columns: style.gridTemplateColumns.split(' ').map(Number.parseFloat),
          columnGap: Number.parseFloat(style.columnGap),
          rowGap: Number.parseFloat(style.rowGap),
          horizontalInterval: sidebar.left - primary.right,
          verticalInterval: sidebar.top - primary.bottom,
          sidebarMargin: getComputedStyle(layout.querySelector('.una-sidebar')).marginTop,
        };
      });
      if (width > 896) {
        expect(geometry.columns).toHaveLength(2);
        expect(Math.abs(geometry.columns[0] / geometry.columns[1] - 1.618)).toBeLessThan(0.002);
        expect(geometry.columnGap).toBeGreaterThanOrEqual(48);
        expect(geometry.columnGap).toBeLessThanOrEqual(80);
        expect(geometry.horizontalInterval).toBeCloseTo(geometry.columnGap, 1);
        if (width >= 1280) expect(geometry.columnGap).toBeCloseTo(width / 24, 1);
      } else {
        expect(geometry.columns).toHaveLength(1);
        expect(geometry.rowGap).toBe(40);
        expect(geometry.sidebarMargin).toBe('0px');
        expect(geometry.verticalInterval).toBeCloseTo(40, 1);
      }
      await expectNoDocumentOverflow(page);
    }
  }
});

test('display roles are one fifth calmer while reading and touch geometry retain their scale', async ({
  page,
}) => {
  const oldFluid = (width, minimum, viewport, maximum) =>
    Math.min(Math.max(minimum * 16, (viewport * width) / 100), maximum * 16);
  for (const [, path] of navigationSurfaces) {
    for (const width of [320, 390, 768, 1280, 1440, 1566]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      for (const [selector, previous] of [
        ['.una-brand', oldFluid(width, 3, 7, 5.5)],
        ['.una-nav a:first-child', oldFluid(width, 1.75, 3, 2.25)],
        ['.una-section-heading h2', oldFluid(width, 2, 3, 2.5)],
        ['.una-module h2', oldFluid(width, 2, 3, 2.5)],
        ['.una-feature--cover .una-title', oldFluid(width, 2, 3, 2.75)],
      ]) {
        const size = await page
          .locator(selector)
          .first()
          .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
        expect(size, `${path} ${selector} at ${width}`).toBeCloseTo(previous * 0.8, 2);
      }
      await expect(page.locator('body')).toHaveCSS('font-size', '16px');
      await expect(page.locator('.una-feature--cover .una-deck')).toHaveCSS('font-size', '16px');
      await expect(page.locator('.una-feature .una-meta')).toHaveCSS('font-size', '13px');
      for (const link of await page.locator('.una-nav > a').all())
        expect((await link.boundingBox()).height).toBeGreaterThanOrEqual(44);
    }
  }
  for (const path of ['/article.html', '/astro/a-website-can-be-a-place/', '/about.html']) {
    for (const width of [320, 390, 768, 1280, 1440, 1566]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(path);
      const titleSize = await page
        .locator('h1.una-title')
        .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
      expect(titleSize).toBeCloseTo(oldFluid(width, 2.25, 4.2, 3.375) * 0.8, 2);
      await expect(page.locator('.una-prose')).toHaveCSS('font-size', '19px');
      await expect(page.locator('.una-prose h2').first()).toHaveCSS('font-size', '25.6px');
      const deck = page.locator('.una-deck');
      if (await deck.count()) await expect(deck).toHaveCSS('font-size', '18px');
    }
  }
});

const artNames = ['cat-studio', 'robot-city', 'ribbon-world', 'kite-festival', 'desktop-garden'];
const artRequestPattern =
  /\/(cat-studio|robot-city|ribbon-world|kite-festival|desktop-garden)-(832|1672)(?:[._-][\w-]+)?\.webp(?:\?|$)/;
const artRoutes = [
  ['/', 'cat-studio'],
  ['/article.html', 'robot-city'],
  ['/blue-hour.html', 'ribbon-world'],
  ['/commonplace.html', 'kite-festival'],
  ['/ordinary.html', 'desktop-garden'],
  ['/about.html', 'desktop-garden'],
  ['/examples/tailwind/', 'cat-studio'],
  ['/astro/', 'cat-studio'],
  ['/astro/a-website-can-be-a-place/', 'robot-city'],
  ['/astro/blue-hour/', 'ribbon-world'],
  ['/astro/commonplace/', 'kite-festival'],
  ['/astro/ordinary/', 'desktop-garden'],
  ['/astro/no-image/', 'robot-city'],
  ['/astro/about/', 'desktop-garden'],
];

test('late artwork delivery cannot shift the editorial layout', async ({ browser }) => {
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__unaArtShifts = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__unaArtShifts.push(entry.value);
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  try {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const [, path] of navigationSurfaces) {
        let release;
        let requested = false;
        const pending = new Promise((resolve) => {
          release = resolve;
        });
        await page.route(artRequestPattern, async (route) => {
          requested = true;
          await pending;
          await route.continue();
        });
        try {
          await page.goto(path, { waitUntil: 'domcontentloaded' });
          await expect.poll(() => requested).toBe(true);
          await page.evaluate(async () => {
            await document.fonts.ready;
            await new Promise((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(resolve)),
            );
            window.__unaArtShifts = [];
          });
          const geometry = () =>
            page
              .locator('.una-masthead, .una-nav, .una-layout, .una-main, .una-title')
              .evaluateAll((elements) =>
                elements.map((element) => {
                  const { x, y, width, height } = element.getBoundingClientRect();
                  return { x, y, width, height };
                }),
              );
          const before = await geometry();
          const completed = page.waitForResponse((response) =>
            artRequestPattern.test(response.url()),
          );
          release();
          expect((await completed).status()).toBe(200);
          await page.evaluate(async () => {
            const image = new Image();
            image.src = getComputedStyle(document.body, '::before').backgroundImage.slice(5, -2);
            await image.decode();
            await new Promise((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(resolve)),
            );
          });
          expect(
            await geometry(),
            `${path} at ${width}: image completion must not move content`,
          ).toEqual(before);
          expect(
            await page.evaluate(() => window.__unaArtShifts.reduce((sum, value) => sum + value, 0)),
            `${path} at ${width}: CLS after font settlement`,
          ).toBe(0);
          await expectNoDocumentOverflow(page);
        } finally {
          release();
          await page.unrouteAll({ behavior: 'wait' });
        }
      }
    }
  } finally {
    await context.close();
  }
});

test('each integration requests one selected responsive WebP with canonical bytes', async ({
  page,
}) => {
  for (const width of [390, 832, 833, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const assetWidth = width <= 832 ? 832 : 1672;
    for (const [path, name] of artRoutes) {
      const requests = [];
      const failures = [];
      const onRequest = (request) => {
        const url = request.url();
        if (artRequestPattern.test(url)) requests.push(url);
        if (['image', 'font'].includes(request.resourceType())) {
          if (!url.startsWith(`${baseURL}/`) && !url.startsWith('data:'))
            failures.push(`External: ${url}`);
          if (/\.png(?:\?|$)/i.test(url)) failures.push(`Source PNG downloaded: ${url}`);
        }
      };
      const onResponse = (response) => {
        if (response.url().startsWith(`${baseURL}/`) && response.status() >= 400)
          failures.push(`${response.status()} ${response.url()}`);
      };
      page.on('request', onRequest);
      page.on('response', onResponse);
      try {
        await page.goto(path);
        await expect(page.locator('body.una')).toHaveAttribute('data-una-art', name);
        const art = await page.locator('body').evaluate((body) => {
          const style = getComputedStyle(body, '::before');
          return {
            image: style.backgroundImage,
            pointerEvents: style.pointerEvents,
            position: style.position,
            top: style.top,
            width: Number.parseFloat(style.width),
            height: Number.parseFloat(style.height),
            size: style.backgroundSize,
            opacity: style.opacity,
          };
        });
        const selected = new RegExp(`/${name}-${assetWidth}(?:[._-][\\w-]+)?\\.webp`);
        expect(art.image, `${path} at ${width}`).toMatch(selected);
        expect(art.pointerEvents).toBe('none');
        const effect = await page.locator('body').getAttribute('data-una-art-effect');
        expect(art.position).toBe(effect === 'static' ? 'absolute' : 'fixed');
        expect(art.top).toBe('0px');
        expect(art.width).toBe(width);
        expect(art.height).toBeCloseTo((width * 941) / 1672, 1);
        expect(art.size).toBe('100% auto');
        expect(art.opacity).toBe('1');
        expect(requests, `${path} at ${width}`).toHaveLength(1);
        expect(new URL(requests[0]).origin).toBe(baseURL);
        expect(new URL(requests[0]).pathname).toMatch(selected);
        const delivered = await page.request.get(requests[0]);
        expect(delivered.status()).toBe(200);
        const canonical = await readFile(`packages/core/assets/art/${name}-${assetWidth}.webp`);
        const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
        expect(sha256(await delivered.body()), `${path}: delivered asset must match core`).toBe(
          sha256(canonical),
        );
        expect(failures).toEqual([]);
        await expect(page.locator('img[src*="/art/"], svg, script')).toHaveCount(0);
        await expectNoDocumentOverflow(page);
      } finally {
        page.off('request', onRequest);
        page.off('response', onResponse);
      }
    }
  }
});

test('art is opt-in and hidden in forced colors and print without changing navigation', async ({
  browser,
}) => {
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();
  try {
    // Remove the attribute before HTML reaches the browser, not after a download has begun.
    await page.route(`${baseURL}/`, async (route) => {
      const response = await route.fetch();
      const html = (await response.text()).replace(/\sdata-una-art="[^"]*"/g, '');
      await route.fulfill({ response, body: html });
    });
    const artRequests = [];
    page.on('request', (request) => {
      if (artRequestPattern.test(request.url())) artRequests.push(request.url());
    });
    await page.goto('/artworks.html');
    await expect(page.locator('body')).not.toHaveAttribute('data-una-art');
    await expect(page.locator('body')).toHaveCSS('padding-top', '0px');
    await expect(page.locator('.una-link-list > li > a')).toHaveCount(5);
    expect(artRequests).toEqual([]);
    await page.goto('/');
    expect(artRequests).toEqual([]);
    expect(
      await page
        .locator('body')
        .evaluate((body) => getComputedStyle(body, '::before').backgroundImage),
    ).toBe('none');
    await page.unrouteAll();
    for (const media of [
      { media: 'screen', forcedColors: 'active' },
      { media: 'print', forcedColors: 'none' },
    ]) {
      await page.emulateMedia(media);
      for (const [, path] of readingSurfaces) {
        await page.goto(path);
        const art = await page.locator('body').evaluate((body) => {
          const style = getComputedStyle(body, '::before');
          return { display: style.display, image: style.backgroundImage };
        });
        expect(art.display === 'none' || art.image === 'none').toBe(true);
        await expect(page.locator('body')).toHaveCSS('padding-top', '0px');
        await expectRuleFreeSurface(page);
        await expectNoDocumentOverflow(page);
      }
    }
  } finally {
    await context.close();
  }
});

test('all five panoramic WebP pairs retain complete composition and a near-white lower band', async ({
  page,
}) => {
  await page.goto('/');
  for (const name of artNames) {
    for (const width of [832, 1672]) {
      const raster = await page.evaluate(
        async ({ variant, width }) => {
          const image = new Image();
          image.src = `/packages/core/assets/art/${variant}-${width}.webp`;
          await image.decode();
          const canvas = document.createElement('canvas');
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          const context = canvas.getContext('2d', { willReadFrequently: true });
          context.drawImage(image, 0, 0);
          const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
          let coloredTop = 0;
          let lowerPixels = 0;
          let nearWhitePixels = 0;
          let minimumLowerChannel = 255;
          for (let offset = 0; offset < pixels.length; offset += 4) {
            const row = Math.floor(offset / 4 / canvas.width);
            const minimum = Math.min(pixels[offset], pixels[offset + 1], pixels[offset + 2]);
            if (row < canvas.height / 2 && minimum < 220) coloredTop++;
            if (row >= canvas.height * 0.9) {
              lowerPixels++;
              minimumLowerChannel = Math.min(minimumLowerChannel, minimum);
              if (minimum >= 245) nearWhitePixels++;
            }
          }
          return {
            width: canvas.width,
            height: canvas.height,
            coloredTop,
            minimumLowerChannel,
            nearWhiteFraction: nearWhitePixels / lowerPixels,
          };
        },
        { variant: name, width },
      );
      expect(raster.width).toBe(width);
      expect(raster.height).toBe(width === 832 ? 468 : 941);
      expect(raster.coloredTop).toBeGreaterThan(1000);
      expect(raster.minimumLowerChannel, `${name}-${width} lower fade`).toBeGreaterThanOrEqual(245);
      expect(raster.nearWhiteFraction).toBe(1);
    }
  }
});

test('rendered atmosphere preserves top text contrast at phone and desktop widths', async ({
  page,
}) => {
  for (const [path, width] of [
    ['/', 320],
    ['/', 390],
    ['/', 768],
    ['/', 1440],
    ['/', 1566],
    ['/article.html', 390],
    ['/article.html', 1440],
    ['/about.html', 390],
    ['/about.html', 1440],
  ]) {
    await page.setViewportSize({ width, height: 1240 });
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    for (const name of artNames) {
      const results = await page.evaluate(async (variant) => {
        document.body.dataset.unaArt = variant;
        const style = getComputedStyle(document.body, '::before');
        if (style.backgroundSize !== '100% auto' || style.backgroundPosition !== '50% 0%') {
          throw new Error(
            'Update the contrast rasterization to match the authored background sizing and position.',
          );
        }
        const image = new Image();
        image.src = style.backgroundImage.slice(5, -2);
        await image.decode();
        const width = document.body.clientWidth;
        const artWidth = Number.parseFloat(style.width);
        const height = Number.parseFloat(style.height);
        const left = Number.parseFloat(style.left);
        const top = Number.parseFloat(style.top);
        if (![artWidth, height, left, top].every(Number.isFinite)) {
          throw new Error('Decorative background geometry must resolve before contrast sampling.');
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = Math.ceil(top + height);
        const context = canvas.getContext('2d', { willReadFrequently: true });
        const scale = artWidth / image.naturalWidth;
        const drawLeft = left;
        context.beginPath();
        context.rect(left, top, artWidth, height);
        context.clip();
        context.globalAlpha = Number.parseFloat(style.opacity);
        context.drawImage(
          image,
          drawLeft,
          top,
          image.naturalWidth * scale,
          image.naturalHeight * scale,
        );
        if (style.maskImage !== 'none') {
          if (!/linear-gradient\(.+75%/.test(style.maskImage)) {
            throw new Error('Update contrast sampling to reflect the authored lower-edge mask.');
          }
          const mask = context.createLinearGradient(0, top, 0, top + height);
          mask.addColorStop(0, '#000');
          mask.addColorStop(0.75, '#000');
          mask.addColorStop(1, 'transparent');
          context.globalCompositeOperation = 'destination-in';
          context.fillStyle = mask;
          context.fillRect(left, top, artWidth, height);
          context.globalCompositeOperation = 'source-over';
        }
        const artGeometry = {
          bodyWidth: width,
          artWidth,
          height,
          left,
          top,
          drawLeft,
          scale,
          size: style.backgroundSize,
          position: style.backgroundPosition,
          opacity: style.opacity,
          mask: style.maskImage,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          contentOffset: getComputedStyle(document.body).paddingTop,
        };
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const rgb = (value) =>
          value
            .match(/[\d.]+/g)
            .slice(0, 3)
            .map(Number);
        const paper = rgb(getComputedStyle(document.body).backgroundColor);
        const luminance = (components) =>
          components.reduce((sum, value, index) => {
            const channel = value / 255;
            return (
              sum +
              (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4) *
                [0.2126, 0.7152, 0.0722][index]
            );
          }, 0);
        const contrast = (ink, ground) => {
          const values = [luminance(ink), luminance(ground)];
          return (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
        };
        return [
          ...document.querySelectorAll(
            '.una-brand, .una-masthead p, .una-nav > a, main .una-title, main .una-prose h2, .una-module h2',
          ),
        ]
          .filter((element) => element.getClientRects().length)
          .map((element) => {
            const bounds = element.getBoundingClientRect();
            const colorElement = element.querySelector(':scope > a') ?? element;
            const text = getComputedStyle(colorElement);
            const colors = [rgb(text.color)];
            // Hover changes only color; test rose at the same actual text location as well.
            if (colorElement.matches('a')) colors.push([155, 101, 107]);
            // Opaque editorial fields cover artwork; titles inside them use that actual ground.
            let field;
            for (
              let ancestor = element;
              ancestor && ancestor !== document.body;
              ancestor = ancestor.parentElement
            ) {
              const background = getComputedStyle(ancestor).backgroundColor;
              const channels = background.match(/[\d.]+/g).map(Number);
              if (channels.length === 3 || channels[3] === 1) {
                field = channels.slice(0, 3);
                break;
              }
            }
            let minimum = Math.min(...colors.map((color) => contrast(color, field ?? paper)));
            for (
              let y = Math.max(0, Math.floor(bounds.top));
              y < Math.min(canvas.height, bounds.bottom);
              y += 2
            ) {
              for (
                let x = Math.max(0, Math.floor(bounds.left));
                x < Math.min(canvas.width, bounds.right);
                x += 2
              ) {
                const offset = (y * canvas.width + x) * 4;
                const alpha = pixels[offset + 3] / 255;
                const ground =
                  field ??
                  paper.map(
                    (channel, index) => pixels[offset + index] * alpha + channel * (1 - alpha),
                  );
                minimum = Math.min(minimum, ...colors.map((color) => contrast(color, ground)));
              }
            }
            const size = Number.parseFloat(text.fontSize);
            const weight = Number.parseFloat(text.fontWeight);
            return {
              text: element.textContent.trim(),
              minimum,
              required: size >= 24 || (size >= 18.667 && weight >= 700) ? 3 : 4.5,
              artGeometry,
              textBounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height },
            };
          });
      }, name);
      for (const result of results)
        expect
          .soft(
            result.minimum,
            `${path}: ${name} at ${width}: ${result.text}; art=${JSON.stringify(result.artGeometry)}; text=${JSON.stringify(result.textBounds)}`,
          )
          .toBeGreaterThanOrEqual(result.required);
      await expectNoDocumentOverflow(page);
    }
  }
});

// Every shipped link role: hover may change the foreground color and nothing else.
const hoverProperties = [
  'fontSize',
  'fontWeight',
  'fontStyle',
  'letterSpacing',
  'lineHeight',
  'textDecorationLine',
  'textDecorationThickness',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'marginTop',
  'marginLeft',
  'transform',
  'translate',
  'scale',
  'width',
  'height',
];
const hoverRoles = [
  'navigation:.una-nav > a',
  'wordmark:.una-brand',
  'title:.una-title a',
  'recent story:.una-recent .una-story h3 a',
  'sidebar list:.una-sidebar .una-link-list a',
  'sidebar text:.una-sidebar .una-module p a',
  'prose:.una-prose a',
  'contents:.una-contents-sidebar a',
  'footer:.una-footer a',
];
const hoverSnapshot = (link) =>
  link.evaluate((element, properties) => {
    const strip = element.closest('.una-nav');
    const style = getComputedStyle(element);
    const rects = [...element.getClientRects()].map((rect) =>
      [
        rect.left + scrollX + (strip ? strip.scrollLeft : 0),
        rect.top + scrollY,
        rect.width,
        rect.height,
      ].map((value) => Math.round(value * 100) / 100),
    );
    const block = element.closest('p, li, h1, h3, nav, footer, header');
    const blockBox = block.getBoundingClientRect();
    return {
      rects,
      block: [blockBox.width, blockBox.height].map((value) => Math.round(value * 100) / 100),
      style: Object.fromEntries(properties.map((name) => [name, style[name]])),
      color: style.color,
    };
  }, hoverProperties);
const hoverRoutes = [
  '/',
  '/article.html',
  '/about.html',
  '/examples/tailwind/',
  '/astro/',
  '/astro/a-website-can-be-a-place/',
  '/astro/about/',
];

for (const path of hoverRoutes) {
  test(`hover changes only link color, never geometry, on ${path}`, async ({ page }) => {
    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      for (const role of hoverRoles) {
        const [name, selector] = role.split(':');
        const links = page.locator(selector);
        for (let index = 0; index < Math.min(await links.count(), 3); index++) {
          const link = links.nth(index);
          if (!(await link.isVisible())) continue;
          await link.scrollIntoViewIfNeeded();
          await page.mouse.move(0, 0);
          const before = await hoverSnapshot(link);
          await link.hover();
          await link.evaluate((element) =>
            Promise.all(element.getAnimations().map((animation) => animation.finished)),
          );
          const during = await hoverSnapshot(link);
          const label = `${path} ${width} ${name} #${index + 1}`;
          expect(during.rects, `${label}: line boxes`).toEqual(before.rects);
          expect(during.block, `${label}: containing block`).toEqual(before.block);
          expect(during.style, `${label}: geometry styles`).toEqual(before.style);
          await page.mouse.move(0, 0);
        }
      }
    }
  });
}

test('titles use the full content width and wrap only where the line runs out', async ({
  page,
}) => {
  const routes = [
    '/article.html',
    '/commonplace.html',
    '/blue-hour.html',
    '/about.html',
    '/',
    '/examples/tailwind/',
    '/astro/',
    '/astro/a-website-can-be-a-place/',
    '/astro/commonplace/',
  ];
  for (const scale of ['100%', '200%']) {
    for (const width of [320, 390, 612, 768, 1280, 1566]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of routes) {
        await page.goto(path);
        await page.evaluate((size) => {
          document.documentElement.style.fontSize = size;
        }, scale);
        await page.evaluate(() => document.fonts.ready);
        const title = await page.locator('h1.una-title').evaluate((heading) => {
          const range = document.createRange();
          range.selectNodeContents(heading);
          const lines = new Set([...range.getClientRects()].map((rect) => Math.round(rect.top)))
            .size;
          const probe = heading.cloneNode(true);
          probe.style.cssText =
            'position:absolute;visibility:hidden;white-space:nowrap;inline-size:auto;max-inline-size:none';
          heading.parentElement.append(probe);
          const natural = probe.getBoundingClientRect().width;
          probe.remove();
          const style = getComputedStyle(heading);
          return {
            text: heading.textContent.trim(),
            breaks: heading.querySelectorAll('br').length,
            lines,
            natural,
            available: heading.getBoundingClientRect().width,
            container: heading.parentElement.getBoundingClientRect().width,
            clipped: heading.scrollWidth > heading.clientWidth + 1,
            measure: style.maxInlineSize,
            wrap: [style.textWrapMode, style.textWrapStyle],
          };
        });
        const label = `${path} ${width} ${scale}: ${title.text}`;
        expect(title.breaks, label).toBe(0);
        expect(title.measure, label).toBe('none');
        expect(title.wrap, label).toEqual(['wrap', 'auto']);
        expect(Math.abs(title.available - title.container), label).toBeLessThan(1);
        expect(title.clipped, label).toBe(false);
        if (title.natural <= title.available + 0.5) expect(title.lines, label).toBe(1);
        else expect(title.lines, label).toBeGreaterThan(1);
        await expectNoDocumentOverflow(page);
      }
    }
  }
  // At the annotated 612px viewport the long lead title fits its natural width on one line.
  await page.setViewportSize({ width: 612, height: 900 });
  for (const path of ['/article.html', '/astro/a-website-can-be-a-place/']) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const lines = await page.locator('h1.una-title').evaluate((heading) => {
      const range = document.createRange();
      range.selectNodeContents(heading);
      return new Set([...range.getClientRects()].map((rect) => Math.round(rect.top))).size;
    });
    expect(lines, path).toBe(1);
  }
});
