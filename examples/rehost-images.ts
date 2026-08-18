/**
 * Runnable example of the rehosting pattern from the README's "Images" section: fetch a handful
 * of product images once, cache them to local disk, then run again to see the conditional GETs
 * short-circuit as 304s.
 *
 *   yarn example:rehost-images
 *
 * Point it at production instead with:
 *
 *   TCGPRISER_BASE_URL=https://api.tcgpriser.se yarn example:rehost-images
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { TcgPriser } from '../src/index.js';

const baseUrl = process.env.TCGPRISER_BASE_URL ?? 'http://localhost:5000';
const tcgpriser = new TcgPriser({ advanced: { baseUrl } });

const cacheDir = join(process.cwd(), '.image-cache');
const etagFile = join(cacheDir, 'etags.json');

async function loadEtags(): Promise<Map<string, string>> {
  try {
    const raw = await readFile(etagFile, 'utf8');
    return new Map(Object.entries(JSON.parse(raw) as Record<string, string>));
  } catch {
    return new Map();
  }
}

async function saveEtags(etags: Map<string, string>): Promise<void> {
  await mkdir(cacheDir, { recursive: true });
  await writeFile(etagFile, JSON.stringify(Object.fromEntries(etags), null, 2));
}

// The same helper from the README, keyed off the image URL's own path so it lines up with the
// API's own products/expansions/stores namespace.
async function rehostImage(imageUrl: string, etags: Map<string, string>): Promise<string> {
  const key = new URL(imageUrl).pathname.replace(/^\/[^/]+\//, '');
  const localPath = join(cacheDir, key);
  const knownEtag = etags.get(key);

  const res = await fetch(imageUrl, { headers: knownEtag ? { 'If-None-Match': knownEtag } : {} });
  if (res.status === 304) {
    console.log(`  304 (unchanged): ${key}`);
    return localPath;
  }

  if (!res.ok) throw new Error(`Failed to fetch ${imageUrl}: ${res.status}`);
  await mkdir(dirname(localPath), { recursive: true });
  await writeFile(localPath, Buffer.from(await res.arrayBuffer()));

  const etag = res.headers.get('etag');
  if (etag) etags.set(key, etag);
  console.log(`  200 (fetched):   ${key}`);
  return localPath;
}

async function main() {
  console.log(`Using API at ${baseUrl}\n`);

  const { data: products } = await tcgpriser.products.list({ limit: 5 });
  const imageUrls = products.map((p) => p.imageUrl).filter((url): url is string => Boolean(url));

  console.log(`Rehosting ${imageUrls.length} product images to ${cacheDir}:`);
  const etags = await loadEtags();
  for (const imageUrl of imageUrls) {
    await rehostImage(imageUrl, etags);
  }
  await saveEtags(etags);

  console.log('\nRun this again — the same images should now come back as 304s.');
}

main().catch((error) => {
  console.error('Example failed:', error);
  process.exitCode = 1;
});
