#!/usr/bin/env node
/**
 * Regenerates `src/generated/openapi.d.ts` from a live API instance — the real source of truth for
 * every wire type in `src/types/*.ts`, which derive from `components['schemas'][...]` via indexed
 * access rather than retyping fields by hand (see README.md "Design notes").
 *
 * The output is committed, not gitignored: this package has no API access at `npm install` time (no
 * network dependency, no breakage if the spec is briefly down), so regenerating is a deliberate,
 * reviewable step you run and commit yourself when the API changes — same workflow pris-tabell-ui
 * uses for its own `generate:openapi-types` script.
 *
 * Usage:
 *   yarn generate:types [specUrl]
 *
 * Defaults to the local dev server's premium spec (the broadest — every schema the public tier needs
 * is a subset of it). Pass a URL to check against production instead:
 *   yarn generate:types https://api.tcgpriser.se/premium-openapi.json
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import openapiTS, { astToString } from 'openapi-typescript';

const specUrl = process.argv[2] ?? 'http://localhost:5000/premium-openapi.json';
const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'generated');
const outFile = path.join(outDir, 'openapi.d.ts');

const ast = await openapiTS(new URL(specUrl));
const contents = astToString(ast);

await mkdir(outDir, { recursive: true });
await writeFile(
  outFile,
  `// GENERATED FILE — do not edit by hand.\n// Run \`yarn generate:types\` to regenerate from a live API instance.\n// Source: ${specUrl}\n\n${contents}`,
);

console.log(`Wrote ${outFile} from ${specUrl}`);
