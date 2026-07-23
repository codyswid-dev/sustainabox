# Sustainabox

Marketing and booking site for Sustainabox — a container home rental in the
Texas Hill Country. Live at [sustainabox.org](https://sustainabox.org).

## Stack

- [Astro](https://astro.build) static site (`src/pages/*.astro`)
- Deployed to Cloudflare (static assets from `dist/`, config in `wrangler.json`)
- No CMS — content is edited directly in the page files

## Development

```sh
npm install
npm run dev      # local dev server
npm run build    # build to dist/
```

## Deploy

```sh
npm run build
npx wrangler deploy
```

Serves `dist/` on sustainabox.org and www.sustainabox.org (custom domains
configured in `wrangler.json`).

## Repo notes

- `public/images/`, `public/pdfs/`, `public/videos/` — site assets
- `source-media/` — full media archive recovered from the old WordPress site
  (gitignored, local only)
- The same property is featured on the Travel365 site's `stay.html`; keep
  pricing, capacity, and amenity claims consistent across both (see
  `CLAUDE.md`)
