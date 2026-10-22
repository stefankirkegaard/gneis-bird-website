// Publish only the static website and design-system assets.
import { cp, mkdir, readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of await readdir(root)) {
  if (/\.html$/.test(name) || ['styles.css','script.js','navigation.js','assets','en'].includes(name)) {
    await cp(path.join(root, name), path.join(output, name), { recursive: true });
  }
}
const docsRoot = path.join(root, 'design-system');
const docsOutput = path.join(output, 'design-system');
await mkdir(docsOutput, { recursive: true });
for (const name of await readdir(docsRoot)) {
  const input = path.join(docsRoot, name);
  if (name === 'public' || name === 'index.html' || (await stat(input)).isDirectory() && !['scripts','source-snapshot'].includes(name)) {
    await cp(input, path.join(docsOutput, name), { recursive: true });
  }
}
// These are browser bundles, served as ordinary static assets in this project.
// Keep them outside Vercel's reserved framework and telemetry namespaces.
const docsPublic = path.join(docsOutput, 'public');
await rename(path.join(docsPublic, '_next'), path.join(docsPublic, 'runtime'));
await rename(path.join(docsPublic, '_vercel'), path.join(docsPublic, 'telemetry'));
async function scopeAssets(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) await scopeAssets(file);
    else if (/\.(html|js|css|json)$/.test(item.name)) {
      const input = await readFile(file, 'utf8');
      const output = input.replaceAll('/_next/', '/runtime/').replaceAll('/_vercel/', '/telemetry/');
      if (output !== input) await writeFile(file, output);
    }
  }
}
await scopeAssets(docsOutput);
console.log('Static website and design system prepared in dist/.');
