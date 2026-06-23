# @piotar/react-promise-bridge

## 1.0.0

### Major Changes

- 9c8e04b: **Breaking:** rename the misspelled `EntryStategy` enum to `EntryStrategy`. Update imports and `open(..., { strategy })` usages accordingly — there is no backwards-compatible alias.

    Also fixes `useFactoryPromiseBridge`: it now memoizes by option _values_ (`isMultiContainer`, `container`) instead of the `options` object identity, so passing an inline options object no longer rebuilds the bridge on every render (which remounted the `Container` and rejected every pending entry).

### Patch Changes

- 6b26efa: Document intentional-but-surprising behaviours: a new "Caveats & gotchas" section in the README and matching agent notes in `SKILL.md` covering unhandled rejections (including fire-and-forget), the single-vs-multi `Container` rules, multi-container element mirroring, pending-entry rejection on `Container` remount, and passing stable references to the hooks.

## 0.7.0

### Minor Changes

- c4db280: Rewrite the README for clarity (what the library does, mental model, quick start, full API reference) and add a `SKILL.md` agent skill (compliant with the agentskills.io specification) so AI agents know how to use the package. Both `README.md` and `SKILL.md` are now included in the published package.

## 0.6.0

### Minor Changes

- c310656: Update build/dev tooling: Vite 8, @vitejs/plugin-react 6, TypeScript 6, vite-plugin-dts 5 and lint-staged 17. Switch `moduleResolution` to `bundler`. No changes to the public API or runtime behavior.
