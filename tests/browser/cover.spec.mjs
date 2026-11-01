import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import sharp from 'sharp';

const illustratedAlt =
  'Three different windows connected by a network of paths, an abstract map of personal websites.';
const indexes = [
  ['static', '/', illustratedAlt],
  ['Tailwind', '/examples/tailwind/', illustratedAlt],
  ['Astro', '/astro/', ''],
];
const widths = [320, 390, 768, 1280, 1566];
const coverSelector = '.una-feature--cover';

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

async function openCover(page, path, width) {
  await page.setViewportSize({ width, height: 1100 });
  await page.goto(path);
  await settle(page);
  const cover = page.locator(coverSelector);
  await expect(cover).toHaveCount(1);
  await cover.scrollIntoViewIfNeeded();
  return cover;
}

async function noOverflow(page) {
  expect(
    await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    })),
  ).toEqual({ scroll: page.viewportSize().width, client: page.viewportSize().width });
}

async function readableGeometry(cover) {
  const geometry = await cover.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const bounds = (child) => {
      const rect = child.getBoundingClientRect();
      return {
        left: rect.left - box.left,
        top: rect.top - box.top,
        right: rect.right - box.left,
        bottom: rect.bottom - box.top,
        width: rect.width,
        height: rect.height,
      };
    };
    const nodes = [...element.querySelectorAll('.una-title, .una-deck, .una-meta, figcaption')];
    return {
      width: box.width,
      height: box.height,
      nodes: nodes.map((child) => ({ text: child.textContent.trim(), ...bounds(child) })),
      copy: bounds(element.querySelector('.una-feature-copy')),
      caption: element.querySelector('figcaption')
        ? bounds(element.querySelector('figcaption'))
        : null,
    };
  });
  for (const node of geometry.nodes) {
    expect(node.width, node.text).toBeGreaterThan(0);
    expect(node.height, node.text).toBeGreaterThan(0);
    expect(node.left, node.text).toBeGreaterThanOrEqual(-1);
    expect(node.top, node.text).toBeGreaterThanOrEqual(-1);
    expect(node.right, node.text).toBeLessThanOrEqual(geometry.width + 1);
    expect(node.bottom, node.text).toBeLessThanOrEqual(geometry.height + 1);
  }
  if (geometry.caption) {
    expect(geometry.caption.top, 'Caption must not overlap the story copy').toBeGreaterThanOrEqual(
      geometry.copy.bottom - 1,
    );
  }
}

function luminance(rgb) {
  return rgb.reduce((total, value, index) => {
    const channel = value / 255;
    const linear = channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    return total + linear * [0.2126, 0.7152, 0.0722][index];
  }, 0);
}

function contrast(foreground, background) {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

// Capture only to memory: actual browser compositing supplies the illustration,
// object-fit crop and tonal overlay. No screenshot files or approximated gradient
// rasterization are used. Hiding the copy preserves its grid geometry while
// exposing the pixels behind each line, including in forced-colors mode where
// transparent authored text colors would be overridden by system colors.
async function expectPaintedContrast(page, cover) {
  const samples = await cover.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const result = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const parent = node.parentElement;
      if (!node.textContent.trim() || !parent.closest('.una-feature-copy, figcaption')) continue;
      if (!parent.getClientRects().length) continue;
      const style = getComputedStyle(parent);
      const range = document.createRange();
      range.selectNodeContents(node);
      const size = Number.parseFloat(style.fontSize);
      const weight = Number.parseFloat(style.fontWeight);
      result.push({
        text: node.textContent.trim(),
        color: style.color
          .match(/[\d.]+/g)
          .slice(0, 3)
          .map(Number),
        required: size >= 24 || (size >= 18.667 && weight >= 700) ? 3 : 4.5,
        rects: [...range.getClientRects()].map((rect) => ({
          x: rect.left - box.left,
          y: rect.top - box.top,
          width: rect.width,
          height: rect.height,
        })),
      });
    }
    return result;
  });
  expect(samples.length).toBeGreaterThan(3);
  const hideText = await page.addStyleTag({
    content: `${coverSelector} .una-feature-copy, ${coverSelector} .una-feature-copy *, ${coverSelector} figcaption { visibility: hidden !important; }`,
  });
  let raster;
  try {
    const buffer = await cover.screenshot({ animations: 'disabled', scale: 'css' });
    raster = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  } finally {
    await hideText.evaluate((element) => element.remove());
  }
  for (const sample of samples) {
    let minimum = Infinity;
    let maximum = 0;
    let pixels = 0;
    for (const rect of sample.rects) {
      for (
        let y = Math.max(0, Math.ceil(rect.y) + 1);
        y < Math.min(raster.info.height, Math.floor(rect.y + rect.height) - 1);
        y += 2
      ) {
        for (
          let x = Math.max(0, Math.ceil(rect.x) + 1);
          x < Math.min(raster.info.width, Math.floor(rect.x + rect.width) - 1);
          x += 2
        ) {
          const offset = (y * raster.info.width + x) * 4;
          const ratio = contrast(sample.color, [...raster.data.subarray(offset, offset + 3)]);
          minimum = Math.min(minimum, ratio);
          maximum = Math.max(maximum, ratio);
          pixels++;
        }
      }
    }
    expect(pixels, `No visible text pixels sampled for ${sample.text}`).toBeGreaterThan(0);
    expect(
      minimum,
      `${sample.text}: painted contrast range ${minimum.toFixed(2)}–${maximum.toFixed(2)}, requires ${sample.required}`,
    ).toBeGreaterThanOrEqual(sample.required);
  }
}

// Paint the cover without its copy, so every pixel is wash, illustration or stage.
async function paintedCover(page, cover, hidden = '') {
  const hide = await page.addStyleTag({
    content: `${coverSelector} .una-feature-copy, ${coverSelector} .una-feature-copy *, ${coverSelector} figcaption${hidden} { visibility: hidden !important; }`,
  });
  try {
    const buffer = await cover.screenshot({ animations: 'disabled', scale: 'css' });
    return await sharp(buffer).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  } finally {
    await hide.evaluate((element) => element.remove());
  }
}

// Every interior pixel; the outer capture pixel can straddle a fractional box edge.
function paintedLuminances({ data, info }) {
  const values = [];
  for (let y = 1; y < info.height - 1; y++)
    for (let x = 1; x < info.width - 1; x++) {
      const offset = (y * info.width + x) * info.channels;
      values.push(luminance([...data.subarray(offset, offset + 3)]));
    }
  return values.sort((a, b) => a - b);
}

async function expectFocusInside(cover, headline) {
  await expect(headline).toBeFocused();
  const outline = await headline.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      style: style.outlineStyle,
      color: style.outlineColor,
      width: Number.parseFloat(style.outlineWidth),
      offset: Number.parseFloat(style.outlineOffset),
    };
  });
  expect(outline.style).toBe('solid');
  // Destination blue stays visible against the lightest washed pixel.
  expect(outline.color).toBe('rgb(232, 239, 248)');
  expect(outline.width).toBeGreaterThanOrEqual(3);
  expect(outline.offset).toBeGreaterThanOrEqual(4);
  const parent = await cover.boundingBox();
  const link = await headline.boundingBox();
  const gutter = outline.width + outline.offset;
  expect(link.x - gutter).toBeGreaterThanOrEqual(parent.x - 1);
  expect(link.x + link.width + gutter).toBeLessThanOrEqual(parent.x + parent.width + 1);
  expect(link.y - gutter).toBeGreaterThanOrEqual(parent.y - 1);
  expect(link.y + link.height + gutter).toBeLessThanOrEqual(parent.y + parent.height + 1);
}

for (const [name, path, alt] of indexes) {
  for (const width of widths) {
    test(`${name} image-led cover at ${width}: full bleed, one destination, readable text and axe`, async ({
      page,
    }) => {
      const cover = await openCover(page, path, width);
      const image = cover.locator('figure img');
      await expect(image).toHaveCount(1);
      await expect(image).toHaveAttribute('alt', alt);
      expect(await image.getAttribute('src')).toContain('connected-web.svg');
      await image.evaluate((element) => element.decode());
      await expect(image).toHaveCSS('object-fit', 'cover');
      const frame = await cover.boundingBox();
      const imageBox = await image.boundingBox();
      for (const property of ['x', 'y', 'width', 'height']) {
        expect(imageBox[property], property).toBeCloseTo(frame[property], 0);
      }
      await expect(cover.locator('.una-feature-copy')).toHaveCount(1);
      await expect(cover.locator('a')).toHaveCount(1);
      await expect(cover.locator('.una-title a')).toHaveCount(1);
      await expect(cover.locator('figure a, img[tabindex="0"]')).toHaveCount(0);
      // The placeholder caption is gone entirely, and its row leaves no reserved gap.
      await expect(cover.locator('figcaption')).toHaveCount(0);
      expect(
        await cover.evaluate((element) => {
          const box = element.getBoundingClientRect();
          const copy = element.querySelector('.una-feature-copy').getBoundingClientRect();
          return (
            box.bottom - copy.bottom - Number.parseFloat(getComputedStyle(element).paddingBottom)
          );
        }),
      ).toBeCloseTo(0, 0);
      expect(
        await cover.locator('.una-feature-copy').evaluate((copy) => {
          const title = copy.querySelector('.una-title a').getBoundingClientRect();
          return copy.contains(document.elementFromPoint(title.left + 2, title.top + 2));
        }),
      ).toBe(true);
      await readableGeometry(cover);
      await noOverflow(page);
      await expectPaintedContrast(page, cover);
      const axe = await new AxeBuilder({ page })
        .include(coverSelector)
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(axe.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes }))).toEqual([]);
    });
  }

  test(`${name} cover hue wash is one uniform layer that grades the whole illustration`, async ({
    page,
  }) => {
    for (const width of [320, 768, 1566]) {
      const cover = await openCover(page, path, width);
      await cover.locator('figure img').evaluate((element) => element.decode());
      const layers = await cover.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const wash = getComputedStyle(element, '::before');
        // A gradient, mask, filter or blend anywhere inside would be local text protection.
        const local = [element, ...element.querySelectorAll('*')].flatMap((node) =>
          [null, '::before', '::after'].flatMap((pseudo) => {
            const style = getComputedStyle(node, pseudo);
            if (pseudo && ['none', 'normal'].includes(style.content)) return [];
            const effects = [
              style.backgroundImage,
              style.maskImage,
              style.filter,
              style.backdropFilter,
            ].filter((value) => value && value !== 'none');
            if (style.mixBlendMode !== 'normal') effects.push(style.mixBlendMode);
            return effects.length ? [`${node.tagName}${pseudo ?? ''}: ${effects.join(' ')}`] : [];
          }),
        );
        return {
          local,
          wash: {
            position: wash.position,
            inset: [wash.top, wash.right, wash.bottom, wash.left],
            edgeToEdge:
              Math.abs(Number.parseFloat(wash.width) - box.width) < 0.5 &&
              Math.abs(Number.parseFloat(wash.height) - box.height) < 0.5,
            color: wash.backgroundColor,
            pointer: wash.pointerEvents,
          },
        };
      });
      expect(layers.local).toEqual([]);
      expect(layers.wash).toEqual({
        position: 'absolute',
        inset: ['0px', '0px', '0px', '0px'],
        edgeToEdge: true,
        color: 'rgba(28, 52, 40, 0.68)',
        pointer: 'none',
      });

      // Without the illustration, the box paints one flat color: wash over stage, no band.
      // The outer capture pixel can straddle a fractional box edge, so it is excluded.
      const flat = await paintedCover(page, cover, `, ${coverSelector} figure img`);
      const { width: columns, height: rowsTall, channels } = flat.info;
      const first = [...flat.data.subarray((columns + 1) * channels, (columns + 1) * channels + 3)];
      let spread = 0;
      for (let y = 1; y < rowsTall - 1; y++)
        for (let x = 1; x < columns - 1; x++)
          for (let channel = 0; channel < 3; channel++)
            spread = Math.max(
              spread,
              Math.abs(flat.data[(y * columns + x) * channels + channel] - first[channel]),
            );
      expect(spread, 'A uniform wash paints no gradient or local band').toBeLessThanOrEqual(1);
      [23, 21, 20].forEach((stage, channel) =>
        expect(
          Math.abs(first[channel] - (0.68 * [28, 52, 40][channel] + 0.32 * stage)),
        ).toBeLessThanOrEqual(1),
      );

      // The graded illustration keeps visible tonal structure, and every text, hover and
      // focus color clears AA against even its brightest washed pixel at this crop.
      const graded = paintedLuminances(await paintedCover(page, cover));
      const darkest = graded[Math.floor(graded.length * 0.02)];
      const brightest = graded.at(-1);
      expect((brightest + 0.05) / (darkest + 0.05), 'Illustration stays visible').toBeGreaterThan(
        2,
      );
      const worst = (rgb) => (luminance(rgb) + 0.05) / (brightest + 0.05);
      expect(worst([255, 254, 250]), 'paper text').toBeGreaterThanOrEqual(4.5);
      expect(worst([244, 198, 204]), 'light-rose hover title').toBeGreaterThanOrEqual(3);
      expect(worst([232, 239, 248]), 'destination-blue focus ring').toBeGreaterThanOrEqual(3);
    }
  });

  test(`${name} cover headline hover stays stable and keyboard has one unclipped destination`, async ({
    page,
  }) => {
    for (const width of [390, 1566]) {
      const cover = await openCover(page, path, width);
      const headline = cover.locator('.una-title a');
      const geometry = () =>
        cover.evaluate((element) => {
          const frame = element.getBoundingClientRect();
          return [...element.querySelectorAll('.una-title, .una-deck, .una-meta, figcaption')].map(
            (child) => {
              const box = child.getBoundingClientRect();
              return {
                x: box.x - frame.x,
                y: box.y - frame.y,
                width: box.width,
                height: box.height,
              };
            },
          );
        });
      await page.mouse.move(0, 0);
      const before = await geometry();
      const weight = await headline.evaluate((element) => getComputedStyle(element).fontWeight);
      await headline.hover();
      await headline.evaluate((element) =>
        Promise.all(element.getAnimations().map((animation) => animation.finished)),
      );
      expect(await geometry()).toEqual(before);
      await expect(headline).toHaveCSS('font-weight', weight);
      await expect(headline).toHaveCSS('color', 'rgb(244, 198, 204)');
      await expectPaintedContrast(page, cover);
      await page.mouse.move(0, 0);
      await page.locator('.una-nav > a').last().focus();
      await page.keyboard.press('Tab');
      await expectFocusInside(cover, headline);
      await page.keyboard.press('Tab');
      await expect(page.locator('.una-recent .una-story h3 a').first()).toBeFocused();
      await page.keyboard.press('Shift+Tab');
      await expectFocusInside(cover, headline);
      const destination = new URL(await headline.getAttribute('href'), page.url()).href;
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(destination);
    }
  });

  test(`${name} cover stays readable in print and forced colors without its illustration`, async ({
    page,
  }) => {
    for (const mode of ['print', 'forced-colors']) {
      for (const width of [390, 1566]) {
        await page.emulateMedia({
          media: mode === 'print' ? 'print' : 'screen',
          forcedColors: mode === 'forced-colors' ? 'active' : 'none',
        });
        const cover = await openCover(page, path, width);
        await expect(cover.locator('figure img')).toBeHidden();
        await expect(cover.locator('.una-title a')).toBeVisible();
        await expect(cover.locator('.una-deck')).toBeVisible();
        await expect(cover.locator('.una-meta')).toBeVisible();
        await expect(cover.locator('figcaption')).toHaveCount(0);
        await readableGeometry(cover);
        await noOverflow(page);
        await expectPaintedContrast(page, cover);
      }
    }
  });

  test(`${name} cover grows for long enlarged text and survives missing fonts or artwork`, async ({
    page,
  }) => {
    for (const width of [320, 390]) {
      await page.route('**/*.woff2', (route) => route.abort());
      try {
        const cover = await openCover(page, path, width);
        await page.evaluate(() => {
          document.documentElement.style.fontSize = '200%';
          document.querySelector('.una-feature--cover .una-title a').textContent =
            'A personal website can keep a very long collection of ordinary moments, patient observations, and SmallUnbrokenDiscoveriesThatStillNeedToWrapAcrossTheCover';
        });
        await settle(page);
        await expect(page.locator('html')).toHaveCSS('font-size', '32px');
        await readableGeometry(cover);
        await noOverflow(page);
        await page.locator('.una-nav > a').last().focus();
        await page.keyboard.press('Tab');
        await expectFocusInside(cover, cover.locator('.una-title a'));
        // An omitted optional figure must leave a complete, usable linked story.
        await cover.locator('figure').evaluate((figure) => figure.remove());
        await readableGeometry(cover);
        await noOverflow(page);
        await expect(cover.locator('a')).toHaveCount(1);
      } finally {
        await page.unroute('**/*.woff2');
      }
      await page.route('**/connected-web.svg', (route) => route.abort());
      try {
        const cover = await openCover(page, path, width);
        expect(
          await cover
            .locator('figure img')
            .evaluate((image) => image.complete && !image.naturalWidth),
        ).toBe(true);
        await readableGeometry(cover);
        await noOverflow(page);
        await expectPaintedContrast(page, cover);
      } finally {
        await page.unroute('**/connected-web.svg');
      }
    }
  });
}
