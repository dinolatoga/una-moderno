import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { format, resolveConfig } from 'prettier';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const outputDirectory = resolve(root, 'packages/core/assets/art');
export const artworkNames = [
  'cat-studio',
  'robot-city',
  'ribbon-world',
  'kite-festival',
  'desktop-garden',
];
export const artworkWidths = [1672, 832];
export const webpOptions = {
  quality: 78,
  effort: 6,
  preset: 'drawing',
  smartSubsample: true,
};
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

export async function buildArt() {
  if (sharp.versions.sharp !== '0.35.5') {
    throw new Error('Artwork builds require the pinned sharp 0.35.5 development dependency.');
  }
  const sourceRecord = JSON.parse(
    await readFile(resolve(root, 'artwork/masters/provenance.json'), 'utf8'),
  );
  if (sourceRecord.assets.map(({ name }) => name).join() !== artworkNames.join()) {
    throw new Error('The master manifest must list the five approved artworks in canonical order.');
  }
  await mkdir(outputDirectory, { recursive: true });
  const allowedFiles = new Set([
    'provenance.json',
    ...artworkNames.flatMap((name) => artworkWidths.map((width) => `${name}-${width}.webp`)),
  ]);
  for (const file of await readdir(outputDirectory)) {
    if (!allowedFiles.has(file)) throw new Error(`Unexpected runtime artwork file: ${file}`);
  }

  const assets = [];
  for (const source of sourceRecord.assets) {
    if (source.file !== `artwork/masters/${source.name}.png`) {
      throw new Error(`Unexpected source path for ${source.name}`);
    }
    const original = await readFile(resolve(root, source.file));
    if (original.length !== source.bytes || sha256(original) !== source.sha256) {
      throw new Error(`Approved PNG master checksum mismatch: ${source.file}`);
    }
    const metadata = await sharp(original).metadata();
    if (
      metadata.format !== 'png' ||
      metadata.width !== 1672 ||
      metadata.height !== 941 ||
      metadata.hasAlpha
    ) {
      throw new Error(`Expected the approved opaque 1672×941 PNG: ${source.file}`);
    }
    const derivatives = [];
    for (const width of artworkWidths) {
      const { data, info } = await sharp(original)
        .resize({ width, withoutEnlargement: true, kernel: 'lanczos3' })
        .webp(webpOptions)
        .toBuffer({ resolveWithObject: true });
      const file = `${source.name}-${width}.webp`;
      await writeFile(resolve(outputDirectory, file), data);
      derivatives.push({
        file,
        width: info.width,
        height: info.height,
        bytes: data.length,
        sha256: sha256(data),
      });
    }
    assets.push({ name: source.name, source, derivatives });
  }

  const provenance = {
    schemaVersion: 2,
    collection: sourceRecord.collection,
    approval: sourceRecord.approval,
    sourcePolicy: sourceRecord.sourcePolicy,
    sourceBoundary: sourceRecord.sourceBoundary,
    transformations: sourceRecord.transformations,
    command: 'npm run build:art',
    encoder: {
      sharp: sharp.versions.sharp,
      libvips: sharp.versions.vips,
      libwebp: sharp.versions.webp,
      format: 'webp',
      options: webpOptions,
      resize: { widths: artworkWidths, kernel: 'lanczos3', withoutEnlargement: true },
      metadata: 'Supplied PNG metadata stays in the exact masters; WebP derivatives omit metadata.',
    },
    qualityAssessment: {
      comparedQuality: [78, 82, 86],
      chosenQuality: 78,
      method:
        'Visual comparison of all five masters, native-size detail crops, and full 832px views against quality 78, 82, and 86 candidates.',
      finding:
        'Quality 78 was the smallest tested output without material visible degradation at the intended display sizes. WebP compression is lossy; pixel identity and SSIM are not claimed.',
    },
    fade: {
      kind: 'Near-white opaque lower image area supplied by the approved master.',
      transparency: false,
      note: 'No intrinsic alpha mask is added. The page controls any additional blend to its paper background.',
    },
    totals: {
      sourcePngBytes: assets.reduce((sum, asset) => sum + asset.source.bytes, 0),
      runtimeWebpBytes: assets
        .flatMap(({ derivatives }) => derivatives)
        .reduce((sum, image) => sum + image.bytes, 0),
      runtimeImageCount: assets.flatMap(({ derivatives }) => derivatives).length,
    },
    assets,
  };
  const provenancePath = resolve(outputDirectory, 'provenance.json');
  await writeFile(
    provenancePath,
    await format(JSON.stringify(provenance), {
      ...(await resolveConfig(provenancePath)),
      parser: 'json',
    }),
  );
  console.log(
    `Artwork built: ${provenance.totals.runtimeImageCount} WebPs, ${provenance.totals.runtimeWebpBytes} B total; exact PNG masters retained separately.`,
  );
  return provenance;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await buildArt();
}
