This folder is hosted at https://gneis-bird-website.vercel.app/design-system/colors as plain static folders on the existing Bird deployment. All design-system assets are scoped to `/design-system/public/`. No deployment configuration or separate Vercel project is needed.

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
