# Security policy

Una Moderno is in unreleased v0.1 development. No stable-version security support window or response-time commitment has been established. The core is HTML/CSS with no runtime JavaScript; repository development tools and optional adapters still have dependencies that require maintenance.

## Report a vulnerability

Do not post credentials, private content, exploit instructions, or a working exploit in a public issue or pull request.

Contact [the maintainer, Dino Latoga](https://github.com/dinolatoga), through a contact method the maintainer publicly provides. If no private route is available, open a neutral [repository issue](https://github.com/dinolatoga/una-moderno/issues/new) asking the maintainer to establish a private security-reporting channel. Keep that request free of vulnerability details. This document does not claim that GitHub private vulnerability reporting is enabled.

Once a private route is agreed, provide the affected commit or version, affected package/example, reproduction steps, expected impact, and a minimal public or fictional fixture. Never send real credentials or private-site data. Maintainers can then agree on investigation and disclosure steps; no fixed turnaround is promised.

## Scope and responsibility

Useful reports include unsafe fixture handling, unintended network requests, script-bearing assets, dependency vulnerabilities with a demonstrated path to impact, and accidental disclosure in repository artifacts. CSS-only consumption does not make the surrounding application secure.

Adapters are responsible for validating content, escaping or sanitizing rich text, resolving trusted URLs, and protecting CMS credentials. The examples do not supply authentication, content persistence, or production CMS security controls. See [the adapter boundary](docs/architecture.md).

Historical Una files were inspected as untrusted data and are not shipped or executed here. Follow [docs/history.md](docs/history.md) for the inspection record. Report ordinary visual and usability bugs through the normal issue templates.
