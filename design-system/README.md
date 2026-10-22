This folder is hosted at https://gneis-bird-website.vercel.app/design-system/colors as plain static folders on the existing Bird deployment. All design-system assets are scoped to `/design-system/public/`. The root `tools/build-site.mjs` script copies the website and design-system files into `dist/` for the shared Vercel deployment.

# Bird Nest — local design system

Local copy of https://nest.trybird.io/design-system, downloaded on 2026-10-22.

## Run

Requires Node.js 18 or newer. No package installation is needed to run the page.

```sh
node scripts/serve.mjs
```

Open http://localhost:5174/design-system/colors. Each sidebar section has a direct URL, for example `/design-system/buttons`. Port 5174 keeps this separate from the Bird marketing website on port 5173. To use another port, run `PORT=5175 node scripts/serve.mjs`.

## Edit

- `public/palette.json`: the 38 named Bird brand colors from the supplied palette reference. Edit here, then run `python3 scripts/build-palette.py` to regenerate `public/palette.css`.
- `public/local.css`: light/dark semantic token mappings, sidebar layout, and component style overrides.
- `public/local.js`: sidebar navigation, separate section views, the color reference, and swatch copying. Existing React examples remain interactive.
- `public/catalog/catalog.json`: page metadata and component categories.
- `public/catalog/index.js`: lazy page rendering, shared usage guidance, and catalogue search.
- `public/catalog/recipes.js` / `runtime.js` / `catalog.css`: component examples, interactions, and Bird styling.
- `public/catalog/foundations.js`: materials, spacing, icons, accessibility, and introduction.
- `public/badges.js`: platform badge variants, priorities, issue states/types, commercial workflows, and palette mapping for original examples.
- `public/buttons.js`: the consolidated Button catalogue, interactive examples, and platform control inventory.
- `public/design-system.html`: the downloaded document with the local CSS/JS hooks added.
- `public/_next/static/`: original compiled Next.js JavaScript, stylesheets, and fonts.
- `source-snapshot/`: untouched original HTML, original manifest, reference screenshots, request inventory, and local verification results.

After refreshing downloaded assets, run `python3 scripts/prepare-for-hosting.py` to scope asset paths for hosting, then run `python3 scripts/export-pages.py` to refresh the static section folders. Refresh the browser after editing. Local files are served without caching.

The downloaded JavaScript preserves React hydration and the original interactive examples. Direct edits to React-managed HTML may be replaced by hydration. Changes to component structure or application logic are best made in the original React/Next.js repository; this download is the published browser build, not that source repository. Server code and the rest of the authenticated Bird application are not included.

The local manifest opens the design-system page. Production analytics endpoints are disabled by the local server. External links such as “View preset” still open their original destinations when clicked.

## Verification

Verified with all external requests blocked:

- All needed page assets load from localhost, with no failed requests or browser JavaScript errors.
- Light/dark switching, discipline selection, checkbox, switch, tabs, and tooltip work.
- Desktop and mobile layouts render correctly.

Optional capture/check scripts use Playwright. If needed, install it separately with `npm install --no-save playwright` and `npx playwright install chromium`, then run `node scripts/verify-local.cjs` for the current sidebar interface. `BROWSER_EXECUTABLE_PATH` can select an existing Chromium executable.

The optional local package manifest is saved as `package.example.json` so this folder is served as static files by the shared Vercel project.

## Typography

Geist is self-hosted in `public/fonts/Geist-Variable.woff2` (official Vercel Geist v1.8.2, SIL Open Font License included in the same folder). Headlines use Medium 500; body copy uses Light 300. The Typography page shows both weights and the corresponding type scale.

## Button catalogue

The Buttons page combines the original six variants and four sizes with neutral filled actions, toolbar/menu triggers, grouped controls, assistant actions, and clickable cards observed in signed-in Chrome on 2026-10-22. Examples use the Bird palette, Geist, and the whole-pixel radius scale. Menu, search, loading, disclosure, and selection interactions run locally with sample data.

The audit visited the 14 main navigation destinations. Budget showed an error/retry state and Changelog did not load. Unopened dialogs and record-specific actions were not exhaustively inspected. Raw signed-in exports and customer content are not included in the repository.

## Badge catalogue

The Badges page combines the shared Badge variants with the four issue priorities, eight supported issue states, nine issue categories, change-order statuses, billing and payment statuses, approval metadata, AI labels, notification counts, and reference tags. Labels and states were collected from the signed-in platform and its published component bundles on 2026-10-22.

Badge colors use dedicated `--badge-*-fill`, `--badge-*-ink`, and `--badge-*-mark` aliases to the named palette. Light fills pair with dark text; dark mode uses deeper fills and pale labels. Green uses Foundation text on Mint Foam with Forest Jade for the status dot or outline. The same mappings decorate the original React badge examples, including tables and listings. All displayed record data is fictional.

## Expanded catalogue

The catalogue has 87 documentation routes covering Bird’s foundations and component examples.

Start at `/design-system/introduction`. Components are grouped by purpose in the sidebar; its filter and global search work across all pages. New pages render lazily when opened. Existing React examples remain mounted and interactive.

The new patterns include searchable selection, calendar, menus and commands, native-dialog overlays, file trees, filters with URL state, pagination, feedback and validation, copying, local sample exports, loading, and media. Materials and spacing share CSS tokens. All examples use Bird's palette, Geist type, and integer radii.

These are representative documentation examples, not a port of Vercel's private React package or every variation of its APIs. Forms and commands use local sample data. Address and phone fields have no external lookup integration. Vercel-specific brand assets are outside Bird's identity. The walkthrough video is an original, silent canvas animation, hosted locally with a caption track.

After adding or changing catalogue routes, run `python3 scripts/export-pages.py`, then build the shared site from the repository root with `node tools/build-site.mjs`.

### Catalogue verification

`node scripts/check-catalog.cjs` uses Playwright to check all 87 pages on desktop and mobile, representative dark-mode pages, keyboard menus, calendar selection, mixed checkboxes, multi-select, modal focus return, filters and URL state, pagination, file selection, clipboard, validation and retry, tabs, progress, undo, PDF sample export, media/captions, and documentation search. Set `BIRD_DOCS_URL` for another preview or production, and `BROWSER_EXECUTABLE_PATH` for an existing Chromium installation.
