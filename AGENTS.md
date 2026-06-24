# AGENTS.md

Guidance for AI agents working in this repo. Read this first instead of re-discovering the project each session.

## What this is

**react-promise-bridge** — a tiny, dependency-free React primitive that bridges the *imperative*
world (call a function, `await` a result) with React's *declarative* rendering. You call
`open(<Dialog />)`, the library mounts the component, and from inside it you call `resolve(value)` /
`reject(reason)` to settle the promise and unmount. Use it for anything that "asks the user something
and returns an answer": confirm dialogs, modals, popups, toasts, wizards — you own the UI, the library
owns the promise.

`package.json` name is `@piotar/react-promise-bridge`; the dir/repo is `react-promise-bridge`. It is a
**library**, not a CLI. Only `react` is a peer dependency (`>=16.6.0`); there are no runtime deps.

## Runtime: Bun (dev) → published ESM/CJS bundle

- **Dev:** `bun run dev` at the root serves nothing (the root is a library, no `index.html`) — run an
  example instead (`examples/01_basic` … `examples/08_destroy_component`, plus `i01_mui` /
  `i02_bootstrap` / `i03_antd` integrations), each its own Vite app.
- **Build:** `bun run build` = `tsc && vite build` → `dist/` with `react-promise-bridge.js` (ESM),
  `react-promise-bridge.umd.cjs` (CJS) and `dist/types/` (via `vite-plugin-dts`). `files` ships `dist`,
  `README.md`, `SKILL.md`.
- **Tests:** Vitest + `@happy-dom/global-registrator` + `@testing-library/react`. `bun run test`
  (`vitest run`) or `bun run coverage`.
- **Lint/format:** Prettier (no eslint). `bun run lint` (`prettier --check`) in CI; `bun run prettier`
  to fix. A husky + lint-staged pre-commit hook formats staged files.

## Commands

```bash
bun install
bun run test        # vitest run
bun run coverage    # vitest run --coverage
bun run typecheck   # tsc --noEmit
bun run lint        # prettier --check
bun run build       # tsc && vite build -> dist/
```

## Architecture

Single public entry `src/index.ts` re-exports everything. Organized by responsibility under `src/`:

- `components/` — `PromiseContextProvider` (provides the bridge via React context) and
  `PromiseBridgeContainer` (mounts/unmounts the entries' components).
- `hooks/` — `usePromiseBridge` (settle from inside a mounted component) plus the entry-point hooks
  `useDeferredPromiseBridge`, `useFactoryPromiseBridge`, `useDisposePromiseBridge`.
- `utils/` — the framework-agnostic core: `PromiseBridge` (registry of entries),
  `PromiseBridgeEntry` / `PromiseEntry`, `PromiseDefer`, `Subscription` /
  `PromiseBridgeSubscription`, `ComposeAbortController`, `UniqueId`.
- `exceptions/` — a typed exception per failure mode (`ContainerDestroyedException`,
  `ContainerLimitReachedException`, `EntryAborted*Exception`, `EntryExistsException`,
  `MissingContextException`, …) all extending `PromiseBridgeException`.
- `constants/` — `PromiseState`, `EntryStrategy`, `AbortSignalStrategy` enums/strategies.
- `PromiseBridgeContext.ts` / `promiseBridge.types.ts` — context object + shared types.

## Conventions

- TypeScript strict; ESM (`"type": "module"`). Public surface is whatever `src/index.ts` re-exports —
  add new exports there.
- Tests live next to source as `*.test.ts`. Cover pure core logic in `utils/*` and hook behavior with
  `@testing-library/react`.
- Formatting is Prettier-owned; don't hand-tune style — run `bun run prettier`.

## Release & CI

- **Versioning:** changesets. For any change that affects the published package, add a changeset
  (`bun run changeset`) and commit the `.md` alongside the PR. A change with no effect on the package
  needs no changeset.
- **CI** (`.github/workflows/ci.yml`): typecheck + lint + test + build on pull requests and pushes to `main`.
- **Release** (`.github/workflows/release.yml`): on push to `main`, `changesets/action@v1`
  opens/updates a "Version Packages" PR (bumps the version + writes `CHANGELOG.md`). **Merging that PR**
  publishes to npm via **OIDC trusted publishing** (no token; provenance is automatic), pushes the
  `vX.Y.Z` tag and creates the GitHub Release. Requires a trusted publisher configured on npmjs.com
  (repo `piotar/react-promise-bridge`, workflow `release.yml`).
- **Cutting a release = just merge the "Version Packages" PR.** No cron, no PAT.
- **Renovate** (`renovate.json`): weekly dependency PRs, automerge non-major after CI + a 3-day
  `minimumReleaseAge`; majors are reviewed manually. Dependency bumps do **not** create their own
  release — they ride into the next changeset-driven publish. For a deps-only release, run
  `bun run changeset` (patch) with a note about the bumps.
