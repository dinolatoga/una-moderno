# Asset provenance

No image, font, implementation code, or editorial content was copied from the historical Una ZIP or the private personal-site repository.

## Original demonstration art and writing

`examples/static-html/assets/*.svg` are original geometric vector compositions authored for this repository in November 2026, under the repository MIT license. They depict abstract windows, a skyline, a notebook, and window frames. These are deliberate flat color/vector fields, not historical screenshots or photographs. SVGs contain no script, external references, or embedded raster content. Copies used by the Astro example retain this provenance.

All specimen stories, dates and publication details are fictional demonstration content authored for this project, under MIT, and every author name except Dino Latoga’s is invented. Dino Latoga, Una Moderno’s creator, appears in the lead-story byline and the index author note, which states only that Dino created Una Moderno and writes this specimen. The stories remain illustrative; they are not biography, factual reporting or endorsements.

## Optional page artwork

Five panoramic illustrations were generated for Una Moderno under Dino’s direction and approved in the session: `cat-studio`, `robot-city`, `ribbon-world`, `kite-festival`, and `desktop-garden`. The approved PNG masters are 1672×941 pixels and are retained byte-for-byte under `artwork/masters/`. They are source assets for the repository, excluded from the consumer package. They contain no transplanted Microsoft/Zune assets. This record describes generation, owner approval and derivative delivery; it does not establish copyright ownership, exclusivity or third-party rights clearance.

`npm run build:art` uses pinned Sharp 0.35.5 with WebP quality 78, effort 6, the `drawing` preset and smart subsampling. Lanczos3 resizing produces two derivatives of each master: 1672×941 and 832×468. The manifest records libvips 8.18.7 and libwebp 1.6.0 for this encoder build. It changes encoding and, for the smaller file, dimensions; it does not crop, recolor, redraw or regenerate the scene. Keep the masters intact and reproduce derivatives through that pipeline. The build checks source byte counts and SHA-256 digests against [the master manifest](../artwork/masters/provenance.json) before encoding. Original provenance metadata remains in the exact PNGs; delivery WebPs omit metadata. Compression is lossy, so derivative pixel identity is not claimed. [Machine-readable provenance](../packages/core/assets/art/provenance.json) records the source and output paths, dimensions, byte counts, SHA-256 hashes, and encoder settings.

The recorded masters total 9,117,372 bytes; all ten WebP derivatives total 900,994 bytes. These are repository asset totals, not a per-page transfer or performance claim. A fresh page selects one scene and the size matching its viewport; resizing across the breakpoint can request the other derivative.

| Scene          | 1672px WebP bytes | 832px WebP bytes |
| -------------- | ----------------: | ---------------: |
| Cat studio     |           107,352 |           45,834 |
| Robot city     |           106,438 |           46,704 |
| Ribbon world   |           131,134 |           55,140 |
| Kite festival  |           140,322 |           57,772 |
| Desktop garden |           149,066 |           61,232 |

The default CSS selects the full-size WebP; at 52rem and below it selects the 832px derivative. Each page selects one allowlisted background through `data-una-art`; omission keeps the plain ground. The image keeps its natural proportions without cover cropping or blanket opacity. The masters have an opaque near-white lower area, not an intrinsic alpha mask. CSS blends only the lower quarter into the paper ground and reserves 39vw before content. Print and forced colors remove both the background and its content offset. Artwork colors belong to the illustrations, not a new interface token palette.

Copy `assets/art/` alongside the core `dist/` directory, preserving the stylesheet-relative URLs, or let an asset-aware build rewrite and publish them. Keep WebP derivatives external so inactive choices are not embedded into CSS. The [chooser](../examples/static-html/artworks.html) selects no artwork and links to all five full-page previews. The optional font and the code-authored SVG story illustrations remain separate assets.

## Inter

`packages/core/assets/inter-variable.woff2` is the unmodified upright variable font from the official [Inter 4.1 release](https://github.com/rsms/inter/releases/tag/v4.1), archive member `web/InterVariable.woff2`. The release is tagged **v4.1**; the binary's embedded name-table version is **4.001;git-9221beed3**. These are distinct identifiers, both retained in [machine-readable provenance](../packages/core/assets/provenance.json).

- [Release archive](https://github.com/rsms/inter/releases/download/v4.1/Inter-4.1.zip): 33,707,794 bytes; SHA-256 `9883fdd4a49d4fb66bd8177ba6625ef9a64aa45899767dde3d36aa425756b11e`. ZIP member CRC checks passed. No publisher-provided archive digest was available; this is a recorded download checksum, not a signature claim.
- Font: 352,240 bytes; SHA-256 `693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3`. It is byte-identical to the [official website's versioned font](https://rsms.me/inter/font-files/InterVariable.woff2?v=4.1).
- Axes: `wght` 100–900, default 400; `opsz` 14–32, default 14. The specimen assigns 200 to its wordmark, 300 to display/navigation, 400 to body text, 500 to metadata and 600 to current navigation, compact headings and inline prose links. No hover state changes weight: every link keeps its weight and changes color only, and the 700 hover token remains for compatibility. The font was not subsetted or converted.
- Copyright: © 2016 The Inter Project Authors. Font software is **SIL Open Font License 1.1**, not MIT.
- [OFL.txt](../packages/core/assets/OFL.txt): 4,380 bytes; SHA-256 `262481e844521b326f5ecd053e59b98c8b2da78c8ee1bdbb6e8174305e54935a`. It is byte-identical to the release notice and [license at the release commit](https://github.com/rsms/inter/blob/e3a3d4c57d5ecc01453a575621882a384c1995a3/LICENSE.txt).

All four canonical font roles resolve to Inter. The optional `fonts.css` entrypoint loads one local upright WOFF2 with `font-display: swap`; no framework dependency or external runtime font request is required. If the stylesheet is omitted or the font fails, system sans remains available. Italic emphasis and italic/600 inline prose links use normal browser synthesis from the upright face; no separate italic or monospace asset is shipped. Prose links remain italic/600 on hover, providing a cue distinct from adjacent upright/600 strong text.

The 352,240-byte asset is approximately **5.06 times** the previous 69,576-byte font file. This is a larger optional download, not a measured performance improvement. The choice preserves the official uncut variable font, including its weight and optical-size axes and 2,937 glyphs, without a project-specific subset or conversion. The byte comparison does not imply identical glyph coverage or capabilities between the two files. Consumers can omit the optional font stylesheet and use system fonts.

The optional fallback uses local Arial/Arial Bold only when installed; those system files are not redistributed. The provenance record retains previously verified Arial units-per-em 2048 and x-height 1062. At optical size 14, Inter has units-per-em 2048, x-height 1118, ascent 1984, descent 494 and line gap 0. Thus `size-adjust = 1118/1062 = 105.2731%`, `ascent-override = (1984/2048)/1.052731 × 100 = 92.0226%`, `descent-override = (494/2048)/1.052731 × 100 = 22.9129%`, and `line-gap-override = 0%`.

This fallback approximates the text-size endpoint only. Inter's x-height changes to 1056 at optical size 32, and Arial does not provide matching variable 200/300/500/600 faces. A fixed fallback cannot match every optical size, weight or glyph width, and does not promise zero layout shift. System sans follows when local Arial is unavailable.

## Visual references

The [Zune inspiration record](zune-inspiration.md) documents public historical references and two owner-supplied reference images. They guide original layout and typography choices; their screenshots, marks, device photography, album covers and proprietary artwork are not distributed as Una assets. Inter is a current owner choice, not a historical Zune font identification.

## Screenshots

Screenshots in `docs/images/` are local browser captures of this repository's fictional specimen, generated by the documented Playwright command. They are visual evidence of a local build, not production deployment evidence. Their capture commands, viewports and review outcomes belong in [the verification record](verification.md). Each PNG carries embedded origin metadata; [captures.json](images/captures.json) records provenance and SHA-256 checksums. Captures must be refreshed and visually opened after a visual-system change. The additional phone capture records the final navigation link scrolled into view with its keyboard focus outline.
