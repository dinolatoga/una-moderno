import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import sharp from 'sharp';

const baseURL = `http://127.0.0.1:${process.env.UNA_TEST_PORT ?? 4321}`;
const indexes = [
  ['static', '/'],
  ['Tailwind', '/examples/tailwind/'],
  ['Astro', '/astro/'],
];
// Every illustrated route keeps its approved panorama; the chooser stays unillustrated.
const routes = [
  ['static index', '/', 'cat-studio'],
  ['static about', '/about.html', 'desktop-garden'],
  ['static long read', '/article.html', 'robot-city'],
  ['static blue hour', '/blue-hour.html', 'ribbon-world'],
  ['static commonplace', '/commonplace.html', 'kite-festival'],
  ['static ordinary', '/ordinary.html', 'desktop-garden'],
  ['Tailwind index', '/examples/tailwind/', 'cat-studio'],
  ['Astro index', '/astro/', 'cat-studio'],
  ['Astro about', '/astro/about/', 'desktop-garden'],
  ['Astro long read', '/astro/a-website-can-be-a-place/', 'robot-city'],
  ['Astro blue hour', '/astro/blue-hour/', 'ribbon-world'],
  ['Astro commonplace', '/astro/commonplace/', 'kite-festival'],
  ['Astro ordinary', '/astro/ordinary/', 'desktop-garden'],
  ['Astro image-free story', '/astro/no-image/', 'robot-city'],
];
// About and a single post from each integration that has them, plus every index.
const representative = routes.filter(([name]) => /index|about|long read/.test(name));
const widths = [320, 390, 768, 1566];
const artRequest =
  /\/(?:cat-studio|robot-city|ribbon-world|kite-festival|desktop-garden)-(?:832|1672)(?:[._-][\w-]+)?\.webp(?:\?|$)/;
// Preview-server comparison: illustrated pages default to the overlap; static opts out.
const comparison = (path, effect) => `${path}?art-effect=${effect}`;

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

async function noOverflow(page) {
  expect(
    await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    })),
  ).toEqual({ scroll: page.viewportSize().width, client: page.viewportSize().width });
}

// The far plane recedes at 0.4x scroll until the 39vw content offset, then holds.
const recede = (scroll, width) => -0.4 * Math.min(scroll, 0.39 * width);

async function planes(page) {
  return page.locator('body').evaluate((body) => {
    const bodyBox = body.getBoundingClientRect();
    const shell = body.querySelector('.una-shell');
    const shellBox = shell.getBoundingClientRect();
    const art = getComputedStyle(body, '::before');
    const backing = getComputedStyle(shell, '::before');
    const top = Number.parseFloat(art.top);
    const shift =
      art.translate === 'none' ? 0 : Number.parseFloat(art.translate.split(' ')[1] ?? 0);
    return {
      scroll: scrollY,
      shellTop: shellBox.top,
      shellHeight: shellBox.height,
      art: {
        position: art.position,
        viewportTop: (art.position === 'fixed' ? top : bodyBox.top + top) + shift,
        shift,
        animation: art.animationName,
        top,
        width: Number.parseFloat(art.width),
        height: Number.parseFloat(art.height),
        pointer: art.pointerEvents,
        image: art.backgroundImage,
      },
      backing: {
        content: backing.content,
        display: backing.display,
        position: backing.position,
        top: Number.parseFloat(backing.top),
        width: Number.parseFloat(backing.width),
        height: Number.parseFloat(backing.height),
        image: backing.backgroundImage,
        pointer: backing.pointerEvents,
      },
    };
  });
}

const isAbsent = (layer) => layer.display === 'none' || ['none', 'normal'].includes(layer.content);

async function paperGutters(page, shellTop) {
  const paper = await page.locator('body').evaluate((body) =>
    getComputedStyle(body)
      .backgroundColor.match(/[\d.]+/g)
      .slice(0, 3)
      .map(Number),
  );
  const { data, info } = await sharp(await page.screenshot({ type: 'png', animations: 'disabled' }))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const y = Math.min(info.height - 2, Math.max(24, Math.ceil(shellTop) + 12));
  for (const x of [1, info.width - 2]) {
    const offset = (y * info.width + x) * info.channels;
    for (let channel = 0; channel < 3; channel++)
      expect(
        Math.abs(data[offset + channel] - paper[channel]),
        `Reading gutter at ${x},${y} must cover artwork with paper`,
      ).toBeLessThanOrEqual(1);
    expect(data[offset + 3]).toBe(255);
  }
}

for (const [name, path] of indexes) {
  test(`${name}: default fixed art and static opt-out preserve native scrolling at all prototype widths`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    for (const width of widths) {
      await page.setViewportSize({ width, height: width === 1566 ? 1240 : 844 });
      for (const effect of ['parallax', 'static']) {
        const requests = [];
        const failures = [];
        const onRequest = (request) => {
          if (artRequest.test(request.url())) requests.push(request.url());
          if (
            ['font', 'image'].includes(request.resourceType()) &&
            !request.url().startsWith(`${baseURL}/`) &&
            !request.url().startsWith('data:')
          )
            failures.push(request.url());
        };
        const onResponse = (response) => {
          if (response.url().startsWith(`${baseURL}/`) && response.status() >= 400)
            failures.push(`${response.status()} ${response.url()}`);
        };
        page.on('request', onRequest);
        page.on('response', onResponse);
        try {
          await page.goto(comparison(path, effect));
          await settle(page);
          await page.evaluate(() => scrollTo(0, 0));
          await settle(page);
          await expect(page.locator('script')).toHaveCount(0);
          // No page opts in: the overlap is the default and only `static` opts out.
          expect(await page.locator('body').getAttribute('data-una-art-effect')).toBe(
            effect === 'parallax' ? null : 'static',
          );
          const initial = await planes(page);
          expect(initial.art.position).toBe(effect === 'parallax' ? 'fixed' : 'absolute');
          expect(initial.art.animation).toBe(effect === 'parallax' ? 'una-art-recede' : 'none');
          expect(initial.art.viewportTop).toBeCloseTo(0, 1);
          expect(initial.art.pointer).toBe('none');
          expect(initial.art.width).toBe(width);
          expect(initial.art.height).toBeCloseTo((width * 941) / 1672, 1);
          if (effect === 'parallax') {
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
            expect(initial.backing.image).toContain('linear-gradient');
            expect(initial.backing.position).toBe('absolute');
            expect(initial.backing.pointer).toBe('none');
            expect(initial.backing.top).toBeLessThan(0);
            expect(initial.backing.width).toBe(width);
            expect(initial.backing.height).toBeGreaterThanOrEqual(
              initial.shellHeight - initial.backing.top - 1,
            );
            await paperGutters(page, initial.shellTop);
          } else expect(isAbsent(initial.backing)).toBe(true);
          const maxScroll = await page.evaluate(
            () => document.documentElement.scrollHeight - innerHeight,
          );
          expect(maxScroll).toBeGreaterThan(100);
          for (const offset of [Math.min(240, maxScroll / 2), maxScroll]) {
            await page.evaluate((value) => scrollTo(0, value), offset);
            await settle(page);
            const current = await planes(page);
            expect(current.scroll).toBeGreaterThan(0);
            expect(current.shellTop).toBeCloseTo(initial.shellTop - current.scroll, 1);
            expect(current.art.viewportTop).toBeCloseTo(
              effect === 'parallax' ? recede(current.scroll, width) : -current.scroll,
              0,
            );
            expect(current.art.height).toBe(initial.art.height);
            if (effect === 'parallax') await paperGutters(page, current.shellTop);
            await noOverflow(page);
          }
          expect(requests, `${name} ${width} ${effect}: one selected artwork`).toHaveLength(1);
          expect(failures).toEqual([]);
        } finally {
          page.off('request', onRequest);
          page.off('response', onResponse);
        }
      }
    }
  });
}

test('reduced motion keeps every illustrated route static in page coordinates with its backing', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [name, path, art] of routes) {
    for (const width of [390, 1566]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(path);
      await settle(page);
      const initial = await planes(page);
      expect(initial.art.image, name).toContain(`/${art}-`);
      expect(initial.art.position, name).toBe('absolute');
      expect(initial.art.animation, name).toBe('none');
      expect(initial.backing.image, name).toContain('linear-gradient');
      await page.evaluate(() => scrollTo(0, 240));
      await settle(page);
      const current = await planes(page);
      expect(current.art.shift, name).toBe(0);
      expect(current.art.viewportTop, name).toBeCloseTo(-current.scroll, 1);
      expect(current.shellTop, name).toBeCloseTo(initial.shellTop - current.scroll, 1);
      await noOverflow(page);
    }
  }
});

async function frame(page) {
  return sharp(await page.screenshot({ type: 'png' }))
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
}

// Measure how far the painted artwork moved between two frames. Only rows above the
// shell's fade are compared, so the result describes the art, not the scrolling shell.
function renderedShift(before, after, [first, last], limit) {
  const { width, channels } = before.info;
  const errors = [];
  for (let shift = 0; shift <= limit; shift++) {
    let error = 0;
    let samples = 0;
    for (let y = first; y < last; y++)
      for (let x = 0; x < width; x += 3) {
        const a = (y * width + x) * channels;
        const b = ((y + shift) * width + x) * channels;
        for (let channel = 0; channel < 3; channel++)
          error += Math.abs(after.data[a + channel] - before.data[b + channel]);
        samples++;
      }
    errors.push(error / samples);
  }
  const best = errors.indexOf(Math.min(...errors));
  return { shift: best, error: errors[best], anchored: errors[0], scrolled: errors[limit] };
}

for (const [name, path, art] of routes) {
  test(`${name}: the rendered panorama itself recedes at 0.4x scroll and never exposes an edge`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    for (const width of name.endsWith('index') ? [320, 390, 768, 1566] : [390, 1566]) {
      await page.setViewportSize({ width, height: width === 1566 ? 1240 : 844 });
      // No query and no attribute: the shared default must deliver the whole effect.
      await page.goto(path);
      await settle(page);
      await page.evaluate(() => scrollTo(0, 0));
      await settle(page);
      const start = await planes(page);
      expect(start.art.image, `${name} keeps its approved panorama`).toContain(`/${art}-`);
      expect(start.art.position).toBe('fixed');
      expect(start.backing.image).toContain('linear-gradient');
      await paperGutters(page, start.shellTop);
      // Scroll-linked, compositor-friendly motion: one root scroll timeline, translate only.
      expect(
        await page.evaluate(() => {
          const animation = document
            .getAnimations()
            .find((item) => item.animationName === 'una-art-recede');
          if (!animation) return null;
          const ignored = ['offset', 'computedOffset', 'easing', 'composite'];
          return {
            pseudo: animation.effect.pseudoElement,
            scroll: animation.timeline instanceof ScrollTimeline,
            root: animation.timeline.source === document.scrollingElement,
            properties: [
              ...new Set(
                animation.effect
                  .getKeyframes()
                  .flatMap((keyframe) => Object.keys(keyframe))
                  .filter((key) => !ignored.includes(key)),
              ),
            ],
          };
        }),
      ).toEqual({ pseudo: '::before', scroll: true, root: true, properties: ['translate'] });

      const distance = width >= 768 ? 150 : 40;
      const before = await frame(page);
      await page.evaluate((value) => scrollTo(0, value), distance);
      await settle(page);
      const after = await frame(page);
      const moved = await planes(page);
      const fadeTop = Math.floor(moved.shellTop + moved.backing.top) - 2;
      expect(fadeTop).toBeGreaterThan(24);
      const measured = renderedShift(before, after, [2, fadeTop], distance);
      expect(
        Math.abs(measured.shift - 0.4 * distance),
        `${name} ${width}: painted art moved ${measured.shift}px for ${distance}px of scroll`,
      ).toBeLessThanOrEqual(1);
      expect(measured.error).toBeLessThan(measured.anchored);
      expect(measured.error).toBeLessThan(measured.scrolled);

      const range = 0.39 * width;
      for (const offset of [0, range / 4, range / 2, range, range * 1.5]) {
        await page.evaluate((value) => scrollTo(0, value), offset);
        await settle(page);
        const state = await planes(page);
        expect(state.art.viewportTop).toBeCloseTo(recede(state.scroll, width), 0);
        // Upward-only travel keeps art at the viewport top, and its opaque area always
        // reaches the shell's rising fade: no paper band opens above or below the art.
        expect(state.art.viewportTop).toBeLessThanOrEqual(0.5);
        expect(state.art.viewportTop + 0.75 * state.art.height).toBeGreaterThanOrEqual(
          state.shellTop + state.backing.top - 0.5,
        );
        await noOverflow(page);
      }
    }
  });
}

test('without scroll timelines the panorama stays a complete anchored composition', async ({
  page,
}) => {
  // One engine cannot toggle @supports; cancelling the declared animation reproduces the
  // unsupported cascade, which keeps the approved fixed far plane and paper shell fade.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const [, path] of representative) {
    for (const width of [390, 1566]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(path);
      await page.addStyleTag({ content: 'body.una::before { animation: none !important; }' });
      await settle(page);
      for (const offset of [0, 120, 0.39 * width, 900]) {
        await page.evaluate((value) => scrollTo(0, value), offset);
        await settle(page);
        const state = await planes(page);
        expect(state.art.position).toBe('fixed');
        expect(state.art.viewportTop).toBeCloseTo(0, 1);
        await paperGutters(page, state.shellTop);
        await noOverflow(page);
      }
    }
  }
});

test('forced colors and print remove artwork, reserved offset and parallax backing', async ({
  page,
}) => {
  for (const media of [
    { media: 'screen', forcedColors: 'active' },
    { media: 'print', forcedColors: 'none' },
  ]) {
    await page.emulateMedia(media);
    for (const [, path] of routes) {
      await page.goto(path);
      await expect(page.locator('body')).toHaveCSS('padding-top', '0px');
      const layers = await page.locator('body').evaluate((body) =>
        [body, body.querySelector('.una-shell')].map((element) => {
          const style = getComputedStyle(element, '::before');
          return { display: style.display, content: style.content, image: style.backgroundImage };
        }),
      );
      for (const layer of layers) expect(isAbsent(layer)).toBe(true);
      await noOverflow(page);
    }
  }
});

test('an effect without a supported artwork cannot reserve space or create decorative layers', async ({
  page,
}) => {
  for (const value of [null, '', 'unknown-artwork']) {
    await page.goto(comparison('/', 'parallax'));
    await page.locator('body').evaluate((body, value) => {
      if (value === null) body.removeAttribute('data-una-art');
      else body.dataset.unaArt = value;
    }, value);
    await expect(page.locator('body')).toHaveCSS('padding-top', '0px');
    const layers = await page.locator('body').evaluate((body) =>
      [body, body.querySelector('.una-shell')].map((element) => {
        const style = getComputedStyle(element, '::before');
        return { display: style.display, content: style.content };
      }),
    );
    for (const layer of layers) expect(isAbsent(layer)).toBe(true);
    await noOverflow(page);
  }
  // Without a direct-child shell there is no paper backing, so the default stays static.
  await page.goto('/');
  await page.locator('body > .una-shell').evaluate((shell) => {
    const wrapper = document.createElement('div');
    shell.replaceWith(wrapper);
    wrapper.append(shell);
  });
  const art = await planes(page);
  expect(art.art.position).toBe('absolute');
  expect(art.art.animation).toBe('none');
  expect(isAbsent(art.backing)).toBe(true);
  // An explicit static opt-out keeps the original page-coordinate composition.
  await page.goto(comparison('/about.html', 'static'));
  const optOut = await planes(page);
  expect(optOut.art.position).toBe('absolute');
  expect(optOut.art.animation).toBe('none');
  expect(isAbsent(optOut.backing)).toBe(true);
});

test('parallax keeps skip navigation and offscreen keyboard destinations visible and reachable', async ({
  page,
}) => {
  for (const [, path] of representative) {
    for (const width of [320, 390, 768, 1566]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(path);
      await settle(page);
      await page.keyboard.press('Tab');
      const skip = page.locator('.una-skip-link');
      await expect(skip).toBeFocused();
      await expect(skip).toHaveCSS('outline-width', '3px');
      expect((await skip.boundingBox()).y).toBeGreaterThanOrEqual(0);
      await page.keyboard.press('Enter');
      await expect(page.locator('main')).toBeFocused();
      await page.goto(path);
      await settle(page);
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await expect(page.locator('.una-brand')).toBeFocused();
      const nav = page.locator('.una-nav');
      for (const link of await nav.locator(':scope > a').all()) {
        await page.keyboard.press('Tab');
        await expect(link).toBeFocused();
        await expect(link).toHaveCSS('outline-width', '3px');
        await expect
          .poll(async () =>
            link.evaluate((element) => {
              const box = element.getBoundingClientRect();
              const parent = element.parentElement.getBoundingClientRect();
              const style = getComputedStyle(element);
              const reach = parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset);
              return (
                box.left - reach >= parent.left - 1 &&
                box.right + reach <= parent.right + 1 &&
                box.top - reach >= parent.top - 1 &&
                box.bottom + reach <= parent.bottom + 1
              );
            }),
          )
          .toBe(true);
      }
      await expect(nav).toHaveCSS('scrollbar-width', 'none');
      await expect(nav.locator(':scope > a').last()).toBeFocused();
      const href = await nav.locator(':scope > a').last().getAttribute('href');
      const destination = new URL(href, page.url()).href;
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(destination);
      await noOverflow(page);
    }
  }
});

test('delayed parallax artwork causes no geometry movement or attributable layout shift', async ({
  browser,
}) => {
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__unaParallaxShifts = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        if (!entry.hadRecentInput) window.__unaParallaxShifts.push(entry.value);
    }).observe({ type: 'layout-shift', buffered: true });
  });
  try {
    for (const width of [390, 1566]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const [, path] of representative) {
        let release;
        let requested = false;
        const pending = new Promise((resolve) => {
          release = resolve;
        });
        await page.route(artRequest, async (route) => {
          requested = true;
          await pending;
          await route.continue();
        });
        try {
          await page.goto(path, { waitUntil: 'domcontentloaded' });
          await expect.poll(() => requested).toBe(true);
          await settle(page);
          await page.evaluate(() => {
            window.__unaParallaxShifts = [];
          });
          const snapshot = () =>
            page
              .locator('.una-shell, .una-masthead, .una-nav, main, .una-title')
              .evaluateAll((elements) =>
                elements.map((element) => {
                  const { x, y, width, height } = element.getBoundingClientRect();
                  return { x, y, width, height };
                }),
              );
          const before = await snapshot();
          const response = page.waitForResponse((response) => artRequest.test(response.url()));
          release();
          expect((await response).status()).toBe(200);
          await page.evaluate(async () => {
            const image = new Image();
            image.src = getComputedStyle(document.body, '::before').backgroundImage.slice(5, -2);
            await image.decode();
          });
          await settle(page);
          expect(await snapshot()).toEqual(before);
          expect(
            await page.evaluate(() =>
              window.__unaParallaxShifts.reduce((sum, value) => sum + value, 0),
            ),
          ).toBe(0);
          await noOverflow(page);
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
