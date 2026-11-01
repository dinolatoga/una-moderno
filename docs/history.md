# Original Una: evidence and provenance

Una Moderno is a new implementation informed by Dino Latoga's 2008 Una WordPress theme. Historical source is evidence, never an executable dependency. This repository does not contain the historical PHP, JavaScript, images, or screenshot.

## Sources and retrieval

Checked on **2026-11-01, 02:02–02:03 UTC**:

| Source                                                                                                                      | Archive capture         | Retrieval result              |
| --------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ----------------------------- |
| [Original theme post](https://web.archive.org/web/20090628124408/http://dinolatoga.com/2008/07/04/una-wordpress-theme)      | 2009-06-28 12:44:08 UTC | HTTP 200; HTML; 153,640 bytes |
| [Original theme ZIP](https://web.archive.org/web/20100105022552id_/http://dinolatoga.com/wp-content/uploads/una_latest.zip) | 2010-01-05 02:25:52 UTC | HTTP 200; ZIP; 169,687 bytes  |

The browser text service could not open either URL. Direct HTTPS retrieval succeeded. The archive's `Memento-Datetime` headers matched both requested captures; the ZIP's archived `Last-Modified` header was 2008-07-26 11:19:25 UTC. These are capture and response metadata, not proof of a release date.

SHA-256 of the downloaded bytes:

```text
post HTML  3c86a38703f378212d837a32536372a07208088d67302ff7c97963d81c8528ff
theme ZIP  71eeb22f201370db1a207e56c985cc6ecd57852efe9380f870bbd388405c3f02
```

The HTML checksum identifies this retrieval, including archive-injected markup; a later replay may differ.

## Safe inspection method

Both responses were downloaded to an operating-system temporary directory with a 20 MiB limit. Python's standard-library ZIP reader listed every member, checked paths for absolute/traversal names and symbolic links, and read selected text members directly in memory. No PHP or JavaScript was executed, no theme was installed, and no archive directory was extracted. A single explicitly named PNG was written to the temporary directory and visually opened.

The ZIP contains **29 members**: 13 PHP files, five CSS files, seven PNG files, two JPEG files, and two directory entries; total uncompressed size is 199,884 bytes. No unsafe member paths or symbolic links were found. This limited inspection is not a security certification of the old theme.

## Verified inheritance

The following facts come from the [archived ZIP](https://web.archive.org/web/20100105022552id_/http://dinolatoga.com/wp-content/uploads/una_latest.zip), inspected as text:

| Evidence                               | Observation                                                                                                                                                                                           |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `una/style.css`, layout declarations   | A 960px wrapper contains 580px primary content, a 20px sidebar margin, and a 360px sidebar. The column ratio is approximately 1.61:1.                                                                 |
| `una/index.php`                        | The index selects the latest post, then three preceding posts. Both the lead image and each thumbnail are conditional. The historical lead is the latest post, not an independently selected feature. |
| `una/style.css`, color declarations    | All seven supplied colors occur: `#47281A`, `#876551`, `#9B656B`, `#727C9F`, `#87A9D3`, `#CD5F19`, `#FAF3E2`.                                                                                         |
| `una/style.css`, typography/background | Arial/Verdana sans-serif; 12px base and 15px article body at 150% line-height. The base is white with a background image; cream is used for quotations and comments.                                  |
| `una/header.php`, `una/sidebar.php`    | Page navigation, search, and functional sidebar modules include categories, recent comments, tags, archives, and recent posts.                                                                        |
| `una/screenshot.png`                   | A 300 × 225 thumbnail was visually inspected: unequal columns, large lead image, restrained colored headings, and compact sidebar modules. It was not copied here.                                    |

The [archived post](https://web.archive.org/web/20090628124408/http://dinolatoga.com/2008/07/04/una-wordpress-theme) describes proportional columns, one leading story followed by three thumbnail stories, and optional images. It reports testing on WordPress 2.5 and 2.5.1. Those historical statements establish no compatibility claim for Una Moderno.

## Maintainer direction, interpretation, and open questions

- **Maintainer direction:** retain the proportional split, leading story plus three recent stories, useful sidebar, warm palette, and clear reading hierarchy. Make the new core framework-neutral and JavaScript-free; Tailwind is optional, Astro is a reference, and WordPress is a v0.2 target.
- **Implementation interpretation:** preserve hierarchy and relationships while replacing fixed-width floats, small text, and inaccessible color pairings with responsive semantic HTML and accessible tokens. A selectable featured story is a modernization of the original latest-post behavior.
- **Chronology unresolved:** the post's dated URL is July 4, 2008; its update text calls July 7 the first release. Widget-readiness dates also differ within the post. Use “2008” unless stronger evidence resolves the chronology.
- **Historical licensing unresolved:** the post asks for retained footer credits and author notification for redistribution. The ZIP has no standalone license file. No MIT grant for those historical files was verified. Una Moderno's MIT license covers the new repository; it is not presented as a relicensing of the archive.

## Asset policy

No historical asset is redistributed or embedded from Wayback. New specimen screenshots must be captured from this repository's fictional demonstration content. Any later inclusion of an original asset requires its exact archive URL, original path, checksum, transformation record, and verified redistribution permission. The two source links above are references, not live demo dependencies.
