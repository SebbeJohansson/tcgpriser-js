# AGENTS.md

## Versioning

Do not bump the `version` field in `package.json`. Versioning and publishing are handled by the
maintainer, not automatically as part of unrelated code changes. Leave `version` untouched even
when a change is breaking — flag it in your summary instead, and let the maintainer decide the
new version number.

Publishing itself is not a separate manual step to offer or perform: the maintainer runs
`npm version <major|minor|patch>`, which bumps `package.json` and creates a `vX.Y.Z` git tag: once
that tag is pushed, `.github/workflows/publish.yml` runs typecheck, tests, and build, then
publishes to npm automatically. Never run `npm publish` directly.
