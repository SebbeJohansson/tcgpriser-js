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
 */
import ts from 'typescript';
import { readFileSync, writeFileSync } from 'node:fs';

const files = ['dist/index.d.ts', 'dist/index.d.cts'];

function containsIndexedAccess(node) {
  if (ts.isIndexedAccessTypeNode(node)) return true;
  let found = false;
  ts.forEachChild(node, (child) => {
    if (!found && containsIndexedAccess(child)) found = true;
  });
  return found;
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

  const result = ts.transform(sourceFile, [transformer]);
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
