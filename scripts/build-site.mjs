import { copyFile, mkdir, readFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, '_site');
const isLocal = (url) => url && !url.startsWith('#') && !/^[a-z][a-z0-9+.-]*:/i.test(url) && !url.startsWith('//');
const clean = (url) => url.split(/[?#]/)[0];

function resolveInsideProject(base, url) {
  const file = path.resolve(base, clean(url));
  if (file !== root && !file.startsWith(root + path.sep)) {
    throw new Error(`Reference points outside the project: ${url}`);
  }
  return file;
}

const html = await readFile(path.join(root, 'index.html'), 'utf8');
const files = new Set([path.join(root, 'index.html')]);

for (const [, url] of html.matchAll(/\b(?:src|href)="([^"]*)"/g)) {
  if (isLocal(url)) files.add(resolveInsideProject(root, url));
}

for (const [, value] of html.matchAll(/\bsrcset="([^"]*)"/g)) {
  for (const candidate of value.split(',')) {
    const url = candidate.trim().split(/\s+/)[0];
    if (isLocal(url)) files.add(resolveInsideProject(root, url));
  }
}

for (const file of [...files].filter((name) => name.endsWith('.css'))) {
  const css = await readFile(file, 'utf8');
  for (const [, url] of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
    if (isLocal(url)) files.add(resolveInsideProject(path.dirname(file), url));
  }
}

await rm(output, { recursive: true, force: true });

let bytes = 0;
for (const file of files) {
  const { size } = await stat(file);
  const target = path.join(output, path.relative(root, file));
  await mkdir(path.dirname(target), { recursive: true });
  await copyFile(file, target);
  bytes += size;
}

console.log(`Built _site: ${files.size} files, ${(bytes / 1024 / 1024).toFixed(2)} MB`);
