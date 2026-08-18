#!/usr/bin/env node
/**
 * Regenerates `src/generated/openapi.d.ts` from a live API instance. Every wire type in
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
 * Defaults to the local dev server's premium spec (the broadest one; every schema the public tier
 * needs is a subset of it). Pass a URL to check against production instead:
 *   yarn generate:types https://api.tcgpriser.se/premium-openapi.json
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import ts from 'typescript';
import openapiTS, { astToString } from 'openapi-typescript';

const specUrl = process.argv[2] ?? 'http://localhost:5000/premium-openapi.json';
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

const { transformed, dispose } = ts.transform(ast, [nullToUndefined]);
const contents = astToString(transformed);
dispose();

await mkdir(outDir, { recursive: true });
await writeFile(
  outFile,
  `// GENERATED FILE - do not edit by hand.\n// Run \`yarn generate:types\` to regenerate from a live API instance.\n// Source: ${specUrl}\n\n${contents}`,
);

console.log(`Wrote ${outFile} from ${specUrl}`);
