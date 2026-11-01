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
  { width: 1280, height: 1000 },
  { width: 1440, height: 1000 },
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
        return { left: box.left, right: box.right, top: box.top, bottom: box.bottom };
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
    await expect(nav.locator(':scope > :not(a)'), route).toHaveCount(0);
    await expect(page.locator('script'), route).toHaveCount(0);
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
        initial.links.some((link) => link.right > initial.right && initial.right - link.left >= 40),
        'At least 40px of the next link should reveal horizontal continuation.',
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
      await links.filter({ hasText: 'The long read' }).focus();
      const href = await links.filter({ hasText: 'The long read' }).getAttribute('href');
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(new URL(href, new URL(path, 'http://127.0.0.1:4321')).href);
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
    baseURL: 'http://127.0.0.1:4321',
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
      await touchSwipe(session, { x: box.x + box.width - 16, y }, { x: box.x + 16, y });
      await expect.poll(async () => (await navigationGeometry(nav)).scrollLeft).toBeGreaterThan(40);
      const last = links.last();
      const href = await last.getAttribute('href');
      await last.tap();
      await expect(page).toHaveURL(new URL(href, new URL(path, 'http://127.0.0.1:4321')).href);
      await page.goto(path);
      // Switching from keyboard to touch must not trap the row on the focused link.
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      for (let index = 0; index < (await links.count()); index++) await page.keyboard.press('Tab');
      await expectUnclippedFocus(nav, last);
      const focusedOffset = (await navigationGeometry(nav)).scrollLeft;
      expect(focusedOffset).toBeGreaterThan(40);
      const focusedBox = await nav.boundingBox();
      const focusedY = focusedBox.y + focusedBox.height / 2;
      await touchSwipe(
        session,
        { x: focusedBox.x + 16, y: focusedY },
        { x: focusedBox.x + focusedBox.width - 16, y: focusedY },
      );
      await expect
        .poll(async () => (await navigationGeometry(nav)).scrollLeft)
        .toBeLessThan(focusedOffset - 40);
      // Allow native momentum to settle so transient movement cannot hide a return to focus.
      await page.waitForTimeout(400);
      expect((await navigationGeometry(nav)).scrollLeft).toBeLessThan(focusedOffset - 40);
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
    await expect(nav.locator('a[aria-current="page"]')).toHaveCSS(
      'text-decoration-line',
      'underline',
    );
    await expect(nav).toHaveCSS('scroll-behavior', 'auto');
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

test('all font roles and specimen weights render the single local Geist variable face', async ({
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
          [400, 700, 800].map((weight) => document.fonts.load(`${weight} 16px Geist`)),
        );
        await document.fonts.ready;
      });
      for (const [selector, weight] of [
        ['.una-deck', '400'],
        ['.una-title a', '700'],
        ['.una-brand', '800'],
        ['[data-font-prose]', '400'],
        ['[data-font-code]', '400'],
      ]) {
        await expect(page.locator(selector)).toHaveCSS('font-weight', weight);
        const family = await page
          .locator(selector)
          .evaluate((element) => getComputedStyle(element).fontFamily);
        expect(family.split(',')[0].replace(/["']/g, '').trim()).toBe('Geist');
        const rendered = await platformFonts(page, session, selector);
        expect(rendered.length, `${path} ${selector}`).toBeGreaterThan(0);
        expect(rendered.every((font) => font.familyName === 'Geist' && font.isCustomFont)).toBe(
          true,
        );
      }
      expect(
        await page.evaluate(() =>
          [...document.fonts]
            .filter((font) => font.family.replace(/["']/g, '') === 'Geist')
            .map(({ weight, style, status }) => ({ weight, style, status })),
        ),
      ).toEqual([{ weight: '100 900', style: 'normal', status: 'loaded' }]);
    }
    expect(fontRequests.length).toBeGreaterThan(0);
    for (const request of fontRequests) {
      const url = new URL(request);
      expect(url.origin).toBe('http://127.0.0.1:4321');
      expect(url.pathname).toMatch(/geist-variable(?:\.[\w-]+)?\.woff2$/);
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
        expect(await page.evaluate(() => document.fonts.check('400 16px Geist'))).toBe(false);
        await expect(page.locator('.una-deck')).toBeVisible();
        const fallback = await platformFonts(page, session, '.una-deck');
        expect(fallback.length).toBeGreaterThan(0);
        expect(fallback.every((font) => font.familyName !== 'Geist')).toBe(true);
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
        expect(loaded.every((font) => font.familyName === 'Geist' && font.isCustomFont)).toBe(true);
        await expectNoDocumentOverflow(page);
      } finally {
        releaseFont();
        await page.unroute('**/*.woff2', holdFont);
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
      await expect(masthead).toHaveText('UnaModerno');
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
