import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';

const widths = [390, 768, 1280, 1440];
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
      await page.setViewportSize({ width, height: 1000 });
      const failures = [];
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
        expect(box.columns[0] / box.columns[1]).toBeCloseTo(580 / 360, 2);
        expect(box.gap).toBe(20);
        const primary = await page.locator('.una-main').boundingBox();
        const sidebar = await page.locator('.una-sidebar > .una-module').first().boundingBox();
        expect(sidebar.x - (primary.x + primary.width)).toBeCloseTo(20, 1);
      } else expect(box.columns).toHaveLength(1);
      if (name.startsWith('static') || width === 390 || width === 1440) {
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
    '/examples/tailwind/',
    '/astro/',
    '/astro/a-website-can-be-a-place/',
    '/astro/no-image/',
  ]) {
    await page.goto(route);
    const links = await page
      .locator('a[href]')
      .evaluateAll((anchors) => [...new Set(anchors.map((a) => a.href))]);
    for (const href of links.filter((url) => url.startsWith('http://127.0.0.1:4321'))) {
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
  const proof = page.locator('.bg-una-blue-light');
  await expect(proof).toHaveCSS('background-color', 'rgb(232, 239, 248)');
  await page.locator('body').evaluate((el) => {
    el.style.setProperty('--una-color-blue-light', '#ddeeff');
    el.style.setProperty('--una-color-ink', '#123456');
  });
  await expect(proof).toHaveCSS('background-color', 'rgb(221, 238, 255)');
  await expect(proof).toHaveCSS('color', 'rgb(18, 52, 86)');
  await expect(page.locator('.una-title')).toHaveCSS('color', 'rgb(18, 52, 86)');
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
  { width: 1440, height: 1000 },
];

const navigation = (page) => {
  const nav = page.locator('nav.una-nav');
  const disclosure = nav.locator('details.una-nav-disclosure');
  return {
    nav,
    wide: nav.locator('.una-nav-links--wide'),
    disclosure,
    toggle: disclosure.locator('summary.una-nav-toggle'),
    links: disclosure.locator('.una-nav-links a'),
  };
};

async function expectNativeMenuState(page, expanded) {
  // Chromium exposes summary as DisclosureTriangle rather than an ARIA button.
  // Inspect its native accessibility state without adding redundant authored ARIA.
  const session = await page.context().newCDPSession(page);
  try {
    await expect
      .poll(async () => {
        const { nodes } = await session.send('Accessibility.getFullAXTree');
        return nodes
          .filter(
            (node) =>
              !node.ignored &&
              node.name?.value === 'Menu' &&
              ['DisclosureTriangle', 'button'].includes(node.role?.value),
          )
          .map((node) => {
            const properties = Object.fromEntries(
              (node.properties ?? []).map(({ name, value }) => [name, value.value]),
            );
            return {
              nativeControl: ['DisclosureTriangle', 'button'].includes(node.role?.value),
              focusable: properties.focusable,
              expanded: properties.expanded,
            };
          });
      })
      .toEqual([{ nativeControl: true, focusable: true, expanded }]);
  } finally {
    await session.detach();
  }
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

test('every shipped page shares the native navigation contract and matching link sets', async ({
  page,
}) => {
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
    const { nav, wide, disclosure, toggle, links } = navigation(page);
    await expect(nav, route).toHaveCount(1);
    await expect(nav, route).toHaveAttribute('aria-label', /.+/);
    await expect(disclosure, route).toHaveCount(1);
    await expect(disclosure, route).not.toHaveAttribute('open');
    await expect(toggle, route).toHaveText('Menu');
    await expect(toggle.locator('svg[aria-hidden="true"]'), route).toHaveCount(1);
    await expect(page.locator('script'), route).toHaveCount(0);
    const linkDetails = (elements) =>
      elements.map((element) => ({
        href: element.getAttribute('href'),
        text: element.textContent.trim(),
        current: element.getAttribute('aria-current'),
      }));
    const desktopLinks = await wide.locator('a').evaluateAll(linkDetails);
    expect(desktopLinks.length, route).toBeGreaterThan(0);
    expect(await links.evaluateAll(linkDetails), route).toEqual(desktopLinks);
    // Native state must not be overridden by a stale, manually authored ARIA state.
    await expect(toggle, route).not.toHaveAttribute('aria-expanded');
    await expect(toggle, route).not.toHaveAttribute('role');
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
  test(`${name}: phone menu has native state, keyboard reachability and an accessible open view`, async ({
    page,
  }) => {
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const { wide, disclosure, toggle, links } = navigation(page);
      await expect(wide).toBeHidden();
      await expect(toggle).toBeVisible();
      await expectNativeMenuState(page, false);
      await expect(links.first()).toBeHidden();
      await page.keyboard.press('Tab');
      await expect(page.locator('.una-skip-link')).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(page.locator('.una-brand')).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(toggle).toBeFocused();
      await expect(toggle).toHaveCSS('outline-style', 'solid');
      await page.keyboard.press('Tab');
      await expect(page.locator('.una-title a')).toBeFocused();
      await toggle.focus();
      await captureNavigation(page, name, width, 'closed');
      const masthead = await page.locator('.una-masthead').boundingBox();
      await toggle.focus();
      await page.keyboard.press('Enter');
      await expect(disclosure).toHaveAttribute('open', '');
      await expectNativeMenuState(page, true);
      const openedMasthead = await page.locator('.una-masthead').boundingBox();
      expect(openedMasthead).toEqual(masthead);
      await page.keyboard.press('Tab');
      for (const link of await links.all()) {
        await expect(link).toBeVisible();
        await expect(link).toBeFocused();
        await page.keyboard.press('Tab');
      }
      await expect(page.locator('.una-title a')).toBeFocused();
      const axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(axe.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes }))).toEqual([]);
      await toggle.focus();
      await captureNavigation(page, name, width, 'open');
      await toggle.focus();
      await page.keyboard.press('Space');
      await expect(disclosure).not.toHaveAttribute('open');
      await expect(links.first()).toBeHidden();
      await expect(toggle).toBeFocused();
      await page.keyboard.press('Enter');
      // Activate a real destination from the disclosure, not only its toggle.
      const destination = links.filter({ hasText: 'The long read' });
      const href = await destination.getAttribute('href');
      await destination.focus();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(new URL(href, new URL(path, 'http://127.0.0.1:4321')).href);
      await expect(page.locator('main h1')).toBeVisible();
    }
  });

  test(`${name}: navigation geometry works at phone edges, landscape, tablet and desktop`, async ({
    page,
  }) => {
    for (const viewport of navigationViewports) {
      await page.setViewportSize(viewport);
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const { nav, wide, disclosure, toggle, links } = navigation(page);
      if (viewport.width <= 576) {
        await expect(wide).toBeHidden();
        await expect(toggle).toBeVisible();
        const target = await toggle.boundingBox();
        expect(target.width).toBeGreaterThanOrEqual(44);
        expect(target.height).toBeGreaterThanOrEqual(44);
        await toggle.click();
        const navBounds = await nav.boundingBox();
        let previousBottom = 0;
        for (const link of await links.all()) {
          const bounds = await link.boundingBox();
          expect(bounds.height).toBeGreaterThanOrEqual(44);
          expect(bounds.width).toBeGreaterThanOrEqual(44);
          expect(bounds.x).toBeCloseTo(navBounds.x, 0);
          expect(bounds.width).toBeCloseTo(navBounds.width, 0);
          expect(bounds.y).toBeGreaterThanOrEqual(previousBottom);
          previousBottom = bounds.y + bounds.height;
        }
      } else {
        await expect(disclosure).toBeHidden();
        await expect(wide).toBeVisible();
        const row = await wide.locator('a').evaluateAll((elements) =>
          elements.map((element) => ({
            top: element.getBoundingClientRect().top,
            bottom: element.getBoundingClientRect().bottom,
          })),
        );
        expect(new Set(row.map(({ top }) => Math.round(top))).size).toBe(1);
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await expect(wide.locator('a').first()).toBeFocused();
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        JSON.stringify(viewport),
      ).toBe(true);
    }
  });
}

test('phone menu responds to touch and its links remain reachable', async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:4321',
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    javaScriptEnabled: false,
  });
  const page = await context.newPage();
  try {
    for (const [, path] of navigationSurfaces) {
      await page.goto(path);
      const { disclosure, toggle, links } = navigation(page);
      await toggle.tap();
      await expect(disclosure).toHaveAttribute('open', '');
      await toggle.tap();
      await expect(disclosure).not.toHaveAttribute('open');
      await toggle.tap();
      const destination = links.filter({ hasText: 'The long read' });
      const href = await destination.getAttribute('href');
      await destination.tap();
      await expect(page).toHaveURL(new URL(href, new URL(path, 'http://127.0.0.1:4321')).href);
      await expect(page.locator('main h1')).toBeVisible();
    }
  } finally {
    await context.close();
  }
});

test('native menu preserves focus, forced colors, reduced motion and resize state', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.goto('/');
  const { wide, disclosure, toggle, links } = navigation(page);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(disclosure).toHaveAttribute('open', '');
  await expect(toggle).toHaveCSS('transition-duration', '0s');
  await expect(toggle.locator('svg')).toBeVisible();
  const icon = await toggle.locator('svg').evaluate((element) => ({
    color: getComputedStyle(element).color,
    toggleColor: getComputedStyle(element.closest('summary')).color,
    stroke: getComputedStyle(element.querySelector('path')).stroke,
  }));
  expect(icon.color).toBe(icon.toggleColor);
  expect(icon.stroke).toBe(icon.color);
  const current = disclosure.locator('.una-nav-links a[aria-current="page"]');
  await expect(current).toBeVisible();
  await expect(current).toHaveCSS('text-decoration-line', 'underline');
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(disclosure).toBeHidden();
  await expect(wide).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(disclosure).toBeVisible();
  await expect(disclosure).toHaveAttribute('open', '');
  await expect(links.first()).toBeVisible();
});
