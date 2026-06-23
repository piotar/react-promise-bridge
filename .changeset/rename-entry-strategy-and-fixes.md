---
"@piotar/react-promise-bridge": major
---

**Breaking:** rename the misspelled `EntryStategy` enum to `EntryStrategy`. Update imports and `open(..., { strategy })` usages accordingly — there is no backwards-compatible alias.

Also fixes `useFactoryPromiseBridge`: it now memoizes by option *values* (`isMultiContainer`, `container`) instead of the `options` object identity, so passing an inline options object no longer rebuilds the bridge on every render (which remounted the `Container` and rejected every pending entry).
