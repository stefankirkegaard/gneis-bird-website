# Site languages

Danish is the default at `/`. English lives under `/en/`.

1. Edit page markup in `en/*.html`.
2. Add or update the corresponding Danish strings in `tools/da.json`.
3. Run `python3 tools/build-locales.py` to regenerate the Danish root pages.

Both languages share `styles.css`, `script.js`, `navigation.js`, and `assets/`.
The language links keep the current page, query, and anchor. Shared JavaScript
localizes dynamic labels based on the document language.

The contact form is hosted by Pipedrive. Its field labels and form copy are
configured in Pipedrive, independently of the site's translation dictionary.

## Original contact page backup

Before replacing the form, the complete local site was saved on GitHub at:

- Branch: `codex/contact-page-backup-2026-10-21`
- Commit: `cde828592977be46858ec9b910291c4144a2cb2e`
- Contact HTML SHA-256: `cb5e61e8e98952f1946e3bc17f47e18942e6291efb6209f5f2094c4fd5da4098`

The snapshot includes the original contact HTML and its shared styles, scripts,
and assets. Restore from the snapshot when the complete original appearance is
needed.
