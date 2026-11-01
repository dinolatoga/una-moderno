# Una Moderno

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

The maintainer specifies a framework-neutral HTML/CSS core, an optional Tailwind v4 layer, and an Astro reference. npm workspaces and build tooling are delegated implementation choices. Core consumers need no Node, framework, Tailwind, or runtime JavaScript.

## Users

Independent writers and publishers adopting an editorial layout, developers integrating it into HTML or a CMS, and maintainers evaluating portability across platforms.

## Product Purpose

**Una Moderno — a portable editorial layout system for the independent web.**

A developer can clone, run documented commands, inspect a responsive editorial specimen, use prebuilt CSS in plain HTML, compile the optional Tailwind example, and build the Astro reference from public fixtures.

## Positioning

Framework-neutral at the core; Tailwind-ready when wanted. A modern descendant of Dino Latoga's 2008 Una WordPress theme, with integrations around one markup and token contract. It is not a WordPress theme at its core.

## Operating Context

Small independent publications, static websites, and CMS templates. Developers inspect and reuse semantic source markup. All example editorial stories are fictional demonstration content.

## Capabilities and Constraints

v0.1 scope: core CSS, HTML templates, static index and article, optional Tailwind v4 mapping, Astro reference, tests and public documentation. EmDash-specific mapping remains experimental unless supported by public API evidence and executable validation. WordPress belongs to v0.2.

Do not access the private personal-site repository or reuse its code, content, history, or credentials. No fabricated compatibility, adoption, performance, or security claims. No production deployment, merge, npm publication, release, or Pages enablement is authorized.

## Brand Commitments

Preserve Una's near-golden editorial split (580:360 with a 20px gap), one featured story followed by three recent thumbnails, useful sidebar modules, strong hierarchy, and readable long-form text. The maintainer supplies the historical palette: #47281A, #876551, #9B656B, #727C9F, #87A9D3, #CD5F19, #FAF3E2. Historical verification is recorded separately in docs/history.md. Avoid generic SaaS scaffolding and cream-and-serif defaults.

The owner pins Zune 4.0 desktop's collection-view principles as the visual language: large light lowercase typography, compact useful lists beside confident square editorial art, generous continuous space, borderless grouping and precise rose accents. The owner explicitly excludes decorative dividers, masthead stripes and link underlines in every state; whitespace, alignment, fields, color and weight provide structure, while the 3px keyboard focus outline remains. The historical Zune website adds a charcoal lead-story field against the open light document, with original editorial art carrying the visual emphasis. Inter is the approved open typeface substitute for every role; sustained prose stays regular weight. This is an independent editorial system, not a media-player clone, and is unaffiliated with Microsoft. No Microsoft/Zune screenshot, logo, proprietary font or other asset may ship. The supplied screenshots are reference-only. Native horizontal navigation and calm article reading take priority over decorative imitation.

The cover headline is paper-colored at rest and rose on hover, retaining weight 300. Inactive navigation is muted/300 and changes only color on hover; the current page is rose/600. Noninteractive module headings use ink. Inline prose links are italic/600, distinguishable from both regular/400 body and upright/600 strong text; their hover changes color without changing weight. The wordmark reads as two separate, unbroken words. On phones its fluid size is capped independently of enlarged prose. The utility line is hidden without reserved space at widths of 30rem or less and remains available at wider layouts.

## Evidence on Hand

A public MIT initial repository and the maintainer brief. The archived post and ZIP are evidence only; their code must never execute. The history inventory records actual retrieval outcomes. No private assets, testimonials, usage metrics, or production compatibility evidence is available.

## Product Principles

- One portable contract; adapters own content acquisition and mapping.
- Reading and useful navigation come before decoration.
- Ship working examples and reproduce claims with checks.
- Keep optional frameworks optional.

## Accessibility & Inclusion

Semantic landmarks, ordered headings, a skip link, visible keyboard focus, descriptive links, sufficient contrast, reduced-motion support, and no document horizontal overflow at 320, 390, 768, 1280, and 1440 pixels. Main navigation remains one horizontal row and scrolls within its own strip when needed. Scrollbar chrome stays hidden; partially visible destinations signal continuation. Article measure targets 65–75ch. The owner-approved typography uses self-hosted Inter for every text role, with weight and scale establishing hierarchy and local/system fallbacks preserving readability.

## Assumptions and Open Decisions

The maintainer explicitly delegates unattended implementation and the code-led design path. Assumptions: English fictional content, light reading surface, no theme switcher, no backend, and no tracking. These can be revisited without changing the product boundary. The optional uncut Inter asset is 352,240 bytes, about 5.06 times the previous 69,576-byte font asset; preserving the official variable font is a documented size tradeoff, not a performance improvement claim. Package registry names, release policy, support commitments, and verified CMS adapters remain open; no npm availability is implied.
