#!/usr/bin/env node
/**
 * Post-processes tsup's bundled `dist/index.d.ts` / `dist/index.d.cts`.
 *
 * `src/types/*.ts` deliberately types everything as `type X = components['schemas']['Y']`
 * (indexed access into the generated schema map) so a field rename in the API is a compile error,
 * not silent drift. The cost: TS has a long-standing limitation where an alias defined via indexed
 * access loses its name in hover/quickinfo once it flows through a generic, e.g. hovering a
 * `Promise<Expansion>`-returning method shows the fully expanded object type instead of
 * `Promise<Expansion>` (microsoft/TypeScript#32287, #50766). A plain object-literal alias doesn't
 * have this problem.
 *
 * This rewrites every alias whose definition contains an indexed access into the literal type the
 * checker resolves it to, leaving compositions of already-clean aliases (`Card | SealedProduct`,
 * `Partial<Record<K, V>>`) untouched since they have no indexed access to resolve.
 *
 * The API's spec now `$ref`s shared schemas rather than inlining a copy at every use site (see
 * `pris-tabell-api`'s `openapi.ts`), and the checker recognizes that sharing: flattening `PackRate`
 * prints its `buckets` field as `components["schemas"]["PackRateBucket"][]` -- a reference, not a
 * duplicated copy -- rather than inlining `PackRateBucket`'s body a second time. Good, except it
 * names that reference through the raw generated path instead of the friendly local alias
 * (`PackRateBucket`) this file already exports for the exact same component. A second pass swaps
 * every remaining `components["schemas"]["X"]` for whichever top-level alias in this same file is a
 * bare, direct alias of `X` (preferring an exported one over an internal helper), so nested
 * references read as real type names throughout, not just at the top level.
 *
 * Both passes skip `paths`/`components`/`webhooks`/`operations`/`$defs` entirely (see
 * `GENERATED_ROOT_NAMES`): that's openapi-typescript's own output, self-referencing via
 * `components["schemas"][...]` throughout, and `components` is re-exported verbatim as this
 * package's escape hatch for the exact wire types. Rewriting inside it would desync it from what
 * openapi-typescript actually generated while still type-checking fine -- silently wrong.
 */
import ts from 'typescript';
import { readFileSync, writeFileSync } from 'node:fs';

const files = ['dist/index.d.ts', 'dist/index.d.cts'];

/** openapi-typescript's own top-level exports: the untouched, self-referential schema map that
 * `components` (this package's escape hatch for anyone who wants the exact wire types) is built
 * from. Neither pass may rewrite anything inside these -- doing so would make `components` stop
 * matching what openapi-typescript actually generated, silently, while still type-checking fine
 * (the rewritten form is structurally identical), which is the worst kind of wrong to ship. */
const GENERATED_ROOT_NAMES = new Set(['paths', 'components', 'webhooks', 'operations', '$defs']);

function isGeneratedRoot(node) {
  return (
    (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
    GENERATED_ROOT_NAMES.has(node.name.text)
  );
}

function containsIndexedAccess(node) {
  if (ts.isIndexedAccessTypeNode(node)) return true;
  let found = false;
  ts.forEachChild(node, (child) => {
    if (!found && containsIndexedAccess(child)) found = true;
  });
  return found;
}

/** Matches `components["schemas"]["X"]` exactly and returns `"X"`, or `null` for anything else. */
function matchComponentSchemaAccess(node) {
  if (!ts.isIndexedAccessTypeNode(node)) return null;
  if (!ts.isLiteralTypeNode(node.indexType) || !ts.isStringLiteral(node.indexType.literal)) return null;
  const schemaName = node.indexType.literal.text;

  const outer = node.objectType;
  if (!ts.isIndexedAccessTypeNode(outer)) return null;
  if (!ts.isLiteralTypeNode(outer.indexType) || !ts.isStringLiteral(outer.indexType.literal)) return null;
  if (outer.indexType.literal.text !== 'schemas') return null;
  if (
    !ts.isTypeReferenceNode(outer.objectType) ||
    !ts.isIdentifier(outer.objectType.typeName) ||
    outer.objectType.typeName.text !== 'components'
  ) {
    return null;
  }
  return schemaName;
}

/** `componentName -> friendly local alias name`, built from every top-level `type X =
 * components["schemas"]["Y"]` declaration in the (pre-flatten) source -- exactly the direct,
 * one-hop aliases `src/types/*.ts` hand-writes. Exported names win over internal helpers
 * (`CardSchema`, `LowestShopOfferSchema`, ...) that alias the same component. */
function buildComponentAliasMap(sourceFile) {
  const map = new Map();
  for (const stmt of sourceFile.statements) {
    if (!ts.isTypeAliasDeclaration(stmt)) continue;
    const componentName = matchComponentSchemaAccess(stmt.type);
    if (!componentName) continue;
    const isExported = stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
    const existing = map.get(componentName);
    if (!existing || (!existing.isExported && isExported)) {
      map.set(componentName, { name: stmt.name.text, isExported });
    }
  }
  return new Map([...map].map(([componentName, v]) => [componentName, v.name]));
}

function flattenIndexedAccessAliases(fileName) {
  const program = ts.createProgram([fileName], {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    strict: true,
    skipLibCheck: true,
  });
  const sourceFile = program.getSourceFile(fileName);
  const checker = program.getTypeChecker();
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const aliasMap = buildComponentAliasMap(sourceFile);

  function resolve(typeNode, enclosingDeclaration) {
    const resolved = checker.getTypeFromTypeNode(typeNode);
    return checker.typeToTypeNode(
      resolved,
      enclosingDeclaration,
      ts.NodeBuilderFlags.NoTruncation |
        ts.NodeBuilderFlags.InTypeAlias |
        ts.NodeBuilderFlags.MultilineObjectLiterals,
    );
  }

  function transformer(context) {
    const visit = (node) => {
      if (isGeneratedRoot(node)) return node;
      if (ts.isTypeAliasDeclaration(node) && containsIndexedAccess(node.type)) {
        const newTypeNode = resolve(node.type, node);
        if (newTypeNode) {
          return ts.factory.updateTypeAliasDeclaration(
            node,
            node.modifiers,
            node.name,
            node.typeParameters,
            newTypeNode,
          );
        }
      }
      // The generated types are otherwise all `type` aliases; `ItemVariantStats` (src/types/premium.ts)
      // is the one hand-written `interface` with a member typed straight off `components[...]`.
      if (ts.isPropertySignature(node) && node.type && containsIndexedAccess(node.type)) {
        const newTypeNode = resolve(node.type, node);
        if (newTypeNode) {
          return ts.factory.updatePropertySignature(
            node,
            node.modifiers,
            node.name,
            node.questionToken,
            newTypeNode,
          );
        }
      }
      return ts.visitEachChild(node, visit, context);
    };
    return (root) => ts.visitNode(root, visit);
  }

  /** Runs after `transformer`: swaps any surviving `components["schemas"]["X"]` reference for its
   * friendly local name, wherever `aliasMap` has one. Declarations resolved in the pass above only
   * keep this shape for fields that reference a distinct, separately-`$ref`'d component (see the
   * module doc comment) -- everything else already became a literal.
   *
   * `currentAliasName` guards against `type BrandRef = BrandRef;`: resolving `BrandRef`'s own
   * top-level `components["schemas"]["Brand"]` RHS can come back as that exact same indexed access
   * (nothing to flatten further -- `Brand` doesn't embed itself), so this pass would otherwise try
   * to rename it into a reference to itself. Skip a substitution whenever it would target the alias
   * declaration it's already inside. */
  function renameTransformer(context) {
    const visit = (node, currentAliasName) => {
      if (isGeneratedRoot(node)) return node;
      if (ts.isTypeAliasDeclaration(node)) {
        return ts.factory.updateTypeAliasDeclaration(
          node,
          node.modifiers,
          node.name,
          node.typeParameters,
          visit(node.type, node.name.text),
        );
      }
      const componentName = matchComponentSchemaAccess(node);
      if (componentName && aliasMap.has(componentName) && aliasMap.get(componentName) !== currentAliasName) {
        return ts.factory.createTypeReferenceNode(aliasMap.get(componentName));
      }
      return ts.visitEachChild(node, (child) => visit(child, currentAliasName), context);
    };
    return (root) => visit(root, undefined);
  }

  const result = ts.transform(sourceFile, [transformer, renameTransformer]);
  const output = printer.printFile(result.transformed[0]);
  result.dispose();
  return output;
}

/** The printer above synthesizes fresh nodes for every rewritten alias, which come out with
 * minimal/inconsistent indentation. Reformat with TS's own LanguageService instead of adding a
 * Prettier dependency just for this. */
function reformat(text, fileName) {
  const host = {
    getScriptFileNames: () => [fileName],
    getScriptVersion: () => '0',
    getScriptSnapshot: (fn) => (fn === fileName ? ts.ScriptSnapshot.fromString(text) : undefined),
    getCurrentDirectory: () => process.cwd(),
    getCompilationSettings: () => ({}),
    getDefaultLibFileName: (opts) => ts.getDefaultLibFilePath(opts),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
  };
  const service = ts.createLanguageService(host, ts.createDocumentRegistry());
  const edits = service.getFormattingEditsForDocument(fileName, {
    ...ts.getDefaultFormatCodeSettings(),
    indentSize: 4,
    convertTabsToSpaces: true,
  });

  let out = text;
  for (const edit of [...edits].sort((a, b) => b.span.start - a.span.start)) {
    out = out.slice(0, edit.span.start) + edit.newText + out.slice(edit.span.start + edit.span.length);
  }
  return out;
}

for (const file of files) {
  const flattened = flattenIndexedAccessAliases(file);
  writeFileSync(file, flattened);
  const formatted = reformat(readFileSync(file, 'utf8'), file);
  writeFileSync(file, formatted);
  console.log(`Flattened indexed-access type aliases in ${file}`);
}
