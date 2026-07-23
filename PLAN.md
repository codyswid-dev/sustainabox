# Sustainabox — Improvement Plan

Status as of 2026-07-22. Done items are deployed to sustainabox.org.

## Done (2026-07-22)

- [x] Recovered old WordPress media library from SiteGround → `source-media/` (local)
- [x] Fixed 16 corrupt images (broken share previews, video poster)
- [x] Removed 29 duplicate images + redundant `Pictures/` folder
- [x] Image optimization: all site-referenced images converted to resized WebP
      (~84 MB → ~9 MB across the referenced set); originals kept on disk
- [x] SEO: sitemap (`@astrojs/sitemap`), `robots.txt`, VacationRental JSON-LD
      structured data, dedicated JPG og-images for social scrapers
- [x] Custom 404 page + Cloudflare `not_found_handling`
- [x] Analytics: confirmed Cloudflare Web Analytics already active
      (dash.cloudflare.com → Analytics → Web analytics → sustainabox.org)
- [x] README rewritten; CLAUDE.md committed; "The The" typo fixed

## Next up (needs Cody/Jenna input)

### 1. Booking flow — replace mailto + Venmo handle
Current flow loses mobile users (mailto fails without a mail app).
Options, pick one:
- **A. Request form** (lowest lift): form on /book posting to a Cloudflare
  Worker that emails you both. No third party, free.
- **B. Availability calendar**: embed shared Google Calendar or a lightweight
  booking widget; still manual confirmation.
- **C. Airbnb/VRBO listing**: most reach, ~15% fees; site links out.
  Travel365 stay.html currently says "NOT ON AIRBNB YET - BOOK DIRECT" —
  update both sites if this changes.

### 2. Auto-deploy on push
Connect the GitHub repo to Cloudflare Workers Builds so every push to `main`
builds and deploys automatically. Then gitignore `dist/` (removes ~150 MB of
build output from the repo and the "forgot to rebuild" failure mode).
Setup: Cloudflare dash → Workers → sustainabox → Settings → Builds.

### 3. Image housekeeping (mechanical, no decisions)
- Delete now-unreferenced original JPG/PNGs from `public/images/`
  (the WebP versions are what the site serves; originals stay in
  `source-media/` and git history). Cuts repo + deploy size dramatically.
- `og-interior.jpg` etc. are the only JPGs that must stay.

### 4. SEO follow-through
- Register site in Google Search Console; submit sitemap.
- Create a Google Business Profile (vacation rental) once you decide how
  public to make the location.
- Consider a short FAQ section on /stays (schema.org FAQPage) — questions
  you get by email are good source material.

### 5. Content ideas (when there's time)
- Construction page: the recovered WordPress archive in `source-media/` has
  survey/topo/septic/elevation scans not currently on the site.
- A "progress blog" or dated build-log section — good for SEO freshness and
  repeat visitors; the DJI drone shots deserve a gallery.
- Add `foundation-walkthrough.mp4` captions/poster polish; consider hosting
  video on Cloudflare Stream if more videos are coming.

## Housekeeping reminders

- Delete `sustainabox-uploads-backup.zip` (176 MB) from SiteGround
  `public_html/wp-content/uploads/` — local copy exists in `source-media/`.
- Decide whether to cancel the SiteGround hosting plan now that everything
  is recovered (old WordPress site is no longer serving the domain).
- Keep pricing/capacity claims in sync with `..\Travel365\site\stay.html`
  (currently: $699 weekend, up to 4 guests, 750 sq ft, 1,280 sq ft deck).
