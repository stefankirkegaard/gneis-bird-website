// Publish only the static website and design-system assets.
import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises';
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
console.log('Static website and design system prepared in dist/.');
