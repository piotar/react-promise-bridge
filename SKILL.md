---
name: react-promise-bridge
description: Use @piotar/react-promise-bridge to render a React component and await the value it produces as a Promise — for confirm dialogs, modals, popups, toasts, pickers, and any "ask the user, get an answer back" flow where you want `const result = await open(<Component/>)` instead of state + callbacks.
license: MIT
compatibility: Requires a React project (react >=16.6.0).
metadata:
  homepage: https://github.com/piotar/react-promise-bridge
  package: "@piotar/react-promise-bridge"
---

# react-promise-bridge

A tiny, dependency-free primitive that turns "mount a component and wait for it to produce a value"
into an awaitable `Promise`. You call `open(<Dialog/>)`, it mounts the component in a `Container`,
and from inside the component `resolve(value)` / `reject(reason)` settle the promise **and unmount
the component**. Use it for confirm dialogs, modals, popups, toasts, color/date pickers, multi-step
prompts — the library owns the promise; the consumer owns all the UI.

## When to use

- A user/agent wants imperative, linear UI flows: `const ok = await open(<Confirm/>)` instead of
  `useState` + `onConfirm`/`onCancel` callbacks + conditional rendering.
- They need to trigger UI from **outside React** (plain JS, an event bus, a service) — `open` is a
  plain function and works anywhere once a `Container` is mounted.

## The three pieces (mental model)

1. `const [Container, open] = PromiseBridge.create()` — a paired container + opener.
2. `<Container />` rendered **once** somewhere in the tree (or on a separate DOM root). Opened
   components mount here.
3. Inside the opened component: `const { resolve, reject, signal } = usePromiseBridge<T>()`.

`open(element, options?)` returns `Promise<T>`. Calling `resolve`/`reject` settles that promise and
unmounts `element`.

## Canonical setup (copy this shape)

```ts
// SystemPromiseBridge.ts — module singleton, importable from anywhere
import { PromiseBridge } from '@piotar/react-promise-bridge';
export const [Container, open] = PromiseBridge.create();
```

```tsx
// render <Container /> once, e.g. near the app root
<App>
    {children}
    <Container />
</App>
```

```tsx
// the component settles the promise via context — no props required
import { usePromiseBridge } from '@piotar/react-promise-bridge';
function Confirm({ message }: { message: string }) {
    const { resolve, reject } = usePromiseBridge<boolean>();
    return (
        <dialog open>
            <p>{message}</p>
            <button onClick={() => reject(new Error('Cancelled'))}>Cancel</button>
            <button onClick={() => resolve(true)}>OK</button>
        </dialog>
    );
}
```

```ts
// open + await, inside or outside React
const ok = await open<boolean>(<Confirm message="Sure?" />); // throws if rejected
```

## Rules for agents (the pitfalls)

- **Mount `<Container />` before calling `open`.** Otherwise `open` throws
  `ContainerNotMountedException`. By default only **one** Container may be mounted per bridge —
  mounting a second throws `ContainerLimitReachedException`. Pass `PromiseBridge.create({ isMultiContainer: true })` to allow several.
- **`usePromiseBridge` only works inside a component opened via `open`.** Calling it anywhere else
  throws `MissingContextException`. The opened component talks back through React context, so it
  needs **no props** for resolve/reject.
- **`reject` rejects the promise** — always `await open(...)` inside `try/catch` (or `.catch`),
  because "cancel" is a rejection, not a resolved `false`.
- **Type both sides:** `open<T>(...)` and `usePromiseBridge<T, R>()` must agree on the resolve type
  `T` (and optionally reject type `R`).
- **Don't manage open/close state yourself.** No `useState(isOpen)`, no conditional rendering of the
  dialog — `open`/`resolve`/`reject` are the entire lifecycle.

## Choosing the right hook

- `usePromiseBridge<T, R>()` — default. `{ resolve, reject, signal }`.
- `useDeferredPromiseBridge<T, R>()` — when you need an **exit animation**. `resolve`/`reject` set
  `state` to `Pending` (component stays mounted); call `trigger` (e.g. `onAnimationEnd`) to actually
  settle. Also exposes `state` (`PromiseState.Initial|Pending|Settled`) and `Provider`.
- `useDisposePromiseBridge(signals?)` — returns an `AbortController` that aborts when the **opener
  component unmounts**; pass its `signal` to `open` so orphaned entries auto-reject.
- `useFactoryPromiseBridge(options?)` — a bridge **scoped to a component instance** (memoized)
  instead of a module singleton; for nested/dynamic containers.

## Controlling entries when opening

`open(element, { signal?, strategy?, id? })`:

- `signal: AbortSignal` — aborting rejects the pending entry (`EntryAbortedBySignalException`).
- `strategy` (`EntryStrategy`, default `Normal`):
  - `Recreate` — reject any existing entry with the same `id`, then open fresh (`id` required).
  - `RejectIfExists` — throw `EntryExistsException` if `id` already open (`id` required).
- Missing `id` with `Recreate`/`RejectIfExists` throws `MissingEntryIdException`.

## Error handling

All errors extend `PromiseBridgeException`; catch broadly or narrow by class. A rejected user action
surfaces as whatever you pass to `reject`. Library-originated rejections include
`ContainerDestroyedException` (container unmounted with entries pending),
`EntryRecreateException`, and the abort exceptions above.

## Working on this repo

- Build: `bun run build` (`tsc && vite build`). Type-check: `bun run type-check`. Tests:
  `bun run test` (Vitest + happy-dom). Coverage: `bun run coverage`.
- Runnable demos live in `examples/*` (each is its own Vite app: `01_basic` … `08_destroy_component`,
  plus `i01_mui` / `i02_bootstrap` / `i03_antd` integrations). The repo root is a library and has no
  `index.html`, so `bun run dev` at the root serves nothing — run an example instead.
- Releases use Changesets: `bun run changeset` to add one, then merging to `main` drives versioning
  and npm publish via CI.
