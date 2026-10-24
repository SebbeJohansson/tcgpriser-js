#!/usr/bin/env node
/**
 * Regenerates `src/generated/openapi.d.ts` from the released delivery contract (or an explicit URL). Every wire type in
 * `src/types/*.ts` derives from `components['schemas'][...]` in that file instead of being retyped
 * by hand. See README.md.
 *
 * Committed, not gitignored: this package has no API access at install time, so regenerating is a
 * deliberate step you run and commit yourself when the API changes. Same workflow pris-tabell-ui
 * uses for its own `generate:openapi-types` script.
 *
 * Usage:
 *   yarn generate:types [specUrl]
 *
 * Defaults to the pinned released delivery contract in the sibling pris-tabell-contract checkout.
 * Accepts a filesystem path, file:// URL or HTTP URL. No running API or database is needed:
 *   yarn generate:types ../pris-tabell-contract/versions/9.0.0/delivery-openapi.json
 *   yarn generate:types https://api.tcgpriser.se/premium-openapi.json
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import ts from 'typescript';
import openapiTS, { astToString } from 'openapi-typescript';

const source = process.argv[2] ?? '../pris-tabell-contract/versions/9.0.0/delivery-openapi.json';
const specUrl = /^[a-z]+:\/\//i.test(source) ? source : pathToFileURL(path.resolve(source)).href;
const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'generated');
const outFile = path.join(outDir, 'openapi.d.ts');

const ast = await openapiTS(new URL(specUrl));

/**
 * openapi-typescript renders every `nullable` schema as `T | null`, matching the raw JSON the API
 * sends over the wire. `HttpClient` (src/http.ts) deep-converts `null` to `undefined` in every
 * response before handing it to callers, so the generated types say `T | undefined` to match what
 * callers actually receive.
 */
function nullToUndefined(context) {
  const visit = (node) =>
    ts.isLiteralTypeNode(node) && node.literal.kind === ts.SyntaxKind.NullKeyword
      ? ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword)
      : ts.visitEachChild(node, visit, context);
  return (node) => ts.visitNode(node, visit);
}

/**
 * What to record as the provenance line.
 *
 * A `file://` source is a local dump, and its absolute path is specific to whoever ran it — pasting
 * someone's home directory (or a sandbox's temp dir) into a committed file says nothing useful to
 * the next reader. Name the dump instead of the machine it happened to sit on.
 */
const sourceLabel = specUrl.startsWith('file://')
  ? path.relative(path.resolve(outDir, '../..'), fileURLToPath(specUrl))
  : specUrl;

const { transformed, dispose } = ts.transform(ast, [nullToUndefined]);
const contents = astToString(transformed);
dispose();

await mkdir(outDir, { recursive: true });
await writeFile(
  outFile,
  `// GENERATED FILE - do not edit by hand.\n// Run \`yarn generate:types\` to regenerate from the released delivery contract (or an explicit URL).\n// Source: ${sourceLabel}\n\n${contents}`,
);

console.log(`Wrote ${outFile} from ${sourceLabel}`);
