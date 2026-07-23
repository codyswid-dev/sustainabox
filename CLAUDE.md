# Sustainabox

Hill Country container home rental site. **This repo is Sustainabox only.**

- **Live:** https://sustainabox.org
- **Repo:** https://github.com/codyswid-dev/sustainabox (branch `main`)
- **Local:** `C:\Users\codys\Documents\Projects\Sustainabox`

## Scope boundary

Separate from PivotRisk (`..\PivotRisk`) and the Travel365 site
(`..\Travel365\site`). Never edit files outside this directory while working
on Sustainabox.

One deliberate coupling: the same property is featured on the Travel365 site's
`stay.html`. Pricing, capacity, and amenity claims must stay consistent across
both. If you change them here, check `..\Travel365\site\stay.html` too.

## Stack

Astro (`astro.config.mjs`, `package.json`, TypeScript). Unlike the sibling
projects this one **has a build step** - install deps and build rather than
editing output directly.

## Deploy

Cloudflare, configured via `wrangler.json`.
