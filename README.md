# react-promise-bridge

[![GitHub package.json version](https://img.shields.io/github/package-json/v/piotar/react-promise-bridge)](https://github.com/piotar/react-promise-bridge)
[![npm (scoped)](https://img.shields.io/npm/v/@piotar/react-promise-bridge)](https://www.npmjs.com/package/@piotar/react-promise-bridge)
![NPM](https://img.shields.io/npm/l/@piotar/react-promise-bridge)

**Render a React component and `await` the value it produces — as a `Promise`.**

`react-promise-bridge` bridges the *imperative* world (call a function, get a result back) with the
*declarative* world of React (render a component). You call `open(<Dialog />)`, the component is
mounted for you, and from inside it you call `resolve(value)` or `reject(reason)` to settle the
promise and unmount the component.

It's a tiny, dependency-free primitive for anything that "asks the user something and returns an
answer": **confirm dialogs, modals, popups, toasts, notifications, color pickers, wizards** — you
own the UI, the library only owns the promise.

## Why

Without it, asking the user a question means juggling state, callbacks, and conditional rendering:

```tsx
// ❌ state + callbacks scattered across the component
const [confirmOpen, setConfirmOpen] = useState(false);
const onDelete = () => setConfirmOpen(true);
// ...somewhere in JSX:
{confirmOpen && <Confirm onYes={reallyDelete} onNo={() => setConfirmOpen(false)} />}
```

With `react-promise-bridge` the question reads top-to-bottom, like any other async call:

```tsx
// ✅ imperative, linear, colocated
const onDelete = async () => {
    try {
        await open(<Confirm message="Delete this item?" />);
        reallyDelete();
    } catch {
        /* user cancelled */
    }
};
```

## Features

- **Lightweight, zero dependencies** (only a React peer dependency, `>=16.6`).
- **`open()` works inside *and* outside React** — call it from event handlers, effects, or plain JS.
- **No prop drilling** — the component talks back through React `context`, not props.
- **Bring your own component** — no wrapper, no required props; existing components just work.
- Multiple independent bridges and **multiple / nested containers**.
- **`AbortSignal` support** — cancel pending entries from the outside.
- **Entry strategies** — recreate or reject duplicates by `id`.
- **Deferred resolution** for exit animations.

## Installation

```sh
npm install @piotar/react-promise-bridge
# or: bun add / yarn add / pnpm add
```

## Mental model

There are exactly three pieces:

| Piece | What it is | Who uses it |
| --- | --- | --- |
| `Container` | Where opened components are mounted | rendered once, anywhere in your tree (or a separate root) |
| `open(element)` | Mounts `element` and returns a `Promise` | your app — event handlers, effects, plain JS |
| `usePromiseBridge()` | Gives the mounted component `{ resolve, reject, signal }` | the component passed to `open()` |

`Container` and `open` come as a pair from `PromiseBridge.create()`. Calling `resolve`/`reject`
settles the promise returned by `open` **and unmounts the component**.

## Quick start

**1. Create a bridge** (a `Container` + its `open` function):

```ts
// SystemPromiseBridge.ts
import { PromiseBridge } from '@piotar/react-promise-bridge';

// Names are yours to choose.
export const [Container, open] = PromiseBridge.create();
```

**2. Mount the `Container` once** — anywhere in the tree, or on a dedicated DOM root:

```tsx
// main.tsx
import { Container } from './SystemPromiseBridge';

root.render(
    <App>
        {/* ...your app... */}
        <Container />
    </App>,
);

// or fully detached from the app tree:
// createRoot(document.getElementById('modals')!).render(<Container />);
```

**3. Build a component that settles the promise** via `usePromiseBridge`:

```tsx
// Confirm.tsx
import { usePromiseBridge } from '@piotar/react-promise-bridge';

export function Confirm({ message }: { message: string }) {
    // <boolean> is the resolve type; reject reason defaults to `any`.
    const { resolve, reject } = usePromiseBridge<boolean>();

    return (
        <dialog open>
            <p>{message}</p>
            <button onClick={() => reject(new Error('Cancelled'))}>Cancel</button>
            <button onClick={() => resolve(true)}>Confirm</button>
        </dialog>
    );
}
```

**4. `open` it and `await` the result** — from inside or outside React:

```tsx
import { open } from './SystemPromiseBridge';

async function confirmDelete() {
    try {
        await open<boolean>(<Confirm message="Delete this item?" />);
        console.log('confirmed');
    } catch (error) {
        console.warn('cancelled', error);
    }
}
```

> ⚠️ The `Container` must be mounted before you call `open`, otherwise `open` throws
> `ContainerNotMountedException`.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/01_basic?file=src/App.tsx)

## API

### `PromiseBridge.create(options?)`

Returns `[Container, open]`.

```ts
const [Container, open] = PromiseBridge.create({
    isMultiContainer: false, // allow more than one mounted Container for this bridge
    // container: CustomContainerComponent, // advanced: override the container renderer
});
```

### `open(element, options?) => Promise<T>`

Mounts `element` in the `Container` and resolves/rejects when the component calls
`resolve`/`reject`. Type the result with `open<T>(...)`.

```ts
open<string>(<ColorPicker />, {
    signal,                          // AbortSignal — abort cancels the pending entry
    strategy: EntryStrategy.Recreate, // how to treat an entry with the same id
    id: 'colorPicker',               // required by Recreate / RejectIfExists strategies
});
```

### Hooks

#### `usePromiseBridge<T, R>()`

The core hook. Read inside a component opened by `open`. Throws `MissingContextException` if used
outside a bridged component.

```ts
const { resolve, reject, signal } = usePromiseBridge<ResolveType, RejectType>();
```

[Example](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/01_basic?file=src/components/ColorPicker.tsx:L12)

#### `useDeferredPromiseBridge<T, R>()`

For **exit animations**. `resolve`/`reject` don't settle immediately — they move `state` to
`Pending` so you can keep the component mounted and play a closing animation, then call `trigger`
(e.g. in `onAnimationEnd`) to actually settle and unmount.

```ts
const { resolve, reject, signal, state, trigger, Provider } =
    useDeferredPromiseBridge<ResolveType, RejectType>();
// state is one of PromiseState.Initial | Pending | Settled
```

[Example](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/02_animation?file=src/components/ColorPicker.tsx:L12)

#### `useDisposePromiseBridge(signals?)`

Returns an `AbortController` whose signal aborts when the **calling (trigger) component** unmounts —
pass `signal` to `open` so any in-flight entry is rejected automatically when its opener disappears.

```ts
const { signal } = useDisposePromiseBridge();
await open(<ColorPicker />, { signal });
```

[Example](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/08_destroy_component?file=src/components/SomeChild.tsx:L8)

#### `useFactoryPromiseBridge(options?)`

Creates a bridge **scoped to the component instance** (memoized), instead of a module-level
singleton. Useful for nested/dynamic containers (e.g. a drawer that can open another drawer).

```ts
const [Container, open] = useFactoryPromiseBridge(options);
```

[Example](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/i03_antd?file=src/components/Drawer.tsx:L32)

### Entry strategies — `EntryStrategy`

Passed via `open(element, { strategy, id })` to control duplicate entries:

| Strategy | Behaviour | Needs `id` |
| --- | --- | --- |
| `EntryStrategy.Normal` *(default)* | Always opens a new entry. | no |
| `EntryStrategy.Recreate` | Rejects an existing entry with the same `id` (with `EntryRecreateException`), then opens a fresh one. | yes |
| `EntryStrategy.RejectIfExists` | If an entry with the same `id` already exists, the new `open` throws `EntryExistsException`. | yes |

### Enums & types

- **`PromiseState`** — `Initial`, `Pending`, `Settled` (used by `useDeferredPromiseBridge`).
- **`AbortSignalStrategy`** — `Any` (abort if *any* source signal aborts) / `Every` (only when *all*
  do); used by `ComposeAbortController` when composing multiple signals.
- **`ComposeAbortController`** — an `AbortController` that aborts based on a set of source signals.

### Exceptions

All extend `PromiseBridgeException`, so you can `catch` broadly or narrow by class. Among them:
`ContainerNotMountedException`, `ContainerDestroyedException`, `ContainerLimitReachedException`,
`EntryExistsException`, `EntryRecreateException`, `MissingEntryIdException`, `MissingContextException`,
`TriggerComponentDestroyedException`, and the abort-related `EntryAbortedBySignalException` /
`ExternalAbortSignalException`.

## Caveats & gotchas

A few behaviours are intentional but easy to trip over:

- **Always handle the promise — even fire-and-forget.** A cancel is a *rejection*, and the library
  also rejects pending entries on its own: when the `Container` unmounts
  (`ContainerDestroyedException`), when a `Recreate` entry is replaced (`EntryRecreateException`),
  and when an `AbortSignal` fires. An `open(...)` whose result you never `await`/`catch` will surface
  as an **unhandled promise rejection**. For fire-and-forget, attach a no-op handler:

  ```ts
  open(<Toast message="Saved" />).catch(() => {});
  ```

- **`Container` must be mounted before `open`.** Calling `open` with no mounted `Container` rejects
  with `ContainerNotMountedException`. By default only **one** `Container` may be mounted per bridge
  (a second throws `ContainerLimitReachedException`); opt into several with
  `PromiseBridge.create({ isMultiContainer: true })`.

- **Multi-container mirrors the *same* element.** With `isMultiContainer`, an opened element is
  rendered in **every** mounted `Container` — i.e. the same component mounts more than once with
  independent local state. Settling from any copy resolves the single shared promise. Use it for
  intentional mirroring, not as a way to "pick" one container.

- **Remounting a `Container` rejects its pending entries.** Unmounting a `Container` (conditional
  rendering, route changes, React Strict Mode's dev remount) dispatches a destroy that rejects any
  in-flight entries with `ContainerDestroyedException`. Keep the `Container` mounted for the lifetime
  of the flows it serves; in practice it mounts empty, so Strict Mode's double-invoke is harmless.

- **Pass stable options to `useFactoryPromiseBridge`.** The bridge is memoized by the *values* of
  `isMultiContainer` and `container`, so an inline object is fine — but if you pass a `signal` array
  to `useDisposePromiseBridge`, give it a **stable reference** (e.g. `useMemo`), since a new array
  identity each render recomposes the controller.

## Examples

| Repository example | Open in StackBlitz |
| --- | --- |
| [#01 Basic](/examples/01_basic/) | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/01_basic?file=src/App.tsx) |
| [#02 Animation](/examples/02_animation/) | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/02_animation?file=src/App.tsx) |
| [#03 Animation with classes](/examples/03_animation_classname/) | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/03_animation_classname?file=src/App.tsx) |
| [#04 Abort controller](/examples/04_abort_controller/) | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/04_abort_controller?file=src/App.tsx) |
| [#05 Entry with strategy recreate](/examples/05_strategy_recreate/) | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/05_strategy_recreate?file=src/App.tsx) |
| [#06 Entry with strategy reject if exists](/examples/06_strategy_reject_if_exists/) | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/06_strategy_reject_if_exists?file=src/App.tsx) |
| [#07 Multicontainer](/examples/07_multicontainers/) | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/07_multicontainers?file=src/App.tsx) |
| [#08 Destroy `Bridge` after destroy trigger component](/examples/08_destroy_component/) | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/08_destroy_component?file=src/App.tsx) |

### Integrations with UI libraries

| Repository example | Open in StackBlitz |
| --- | --- |
| [#i01 Material UI (MUI)](/examples/i01_mui/) | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/i01_mui?file=src/App.tsx) |
| [#i02 React Bootstrap](/examples/i02_bootstrap/) | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/i02_bootstrap?file=src/App.tsx) |
| [#i03 Ant design (antd)](/examples/i03_antd/) | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/i03_antd?file=src/App.tsx) |

## AI agents

A [`SKILL.md`](./SKILL.md) (agentskills.io format) ships with the package so the library can be taught
to AI agents and installed via a skill manager.

### Claude Code plugin

The package doubles as a [Claude Code](https://docs.claude.com/en/docs/claude-code) plugin — a
[`.claude-plugin/plugin.json`](./.claude-plugin/plugin.json) manifest exposes the bundled `SKILL.md`
as a `react-promise-bridge` skill. Load it straight from `node_modules` (no separate install):

```sh
claude --plugin-dir node_modules/@piotar/react-promise-bridge     # per-session
```

To make the skill available globally instead, symlink the installed package into your skills directory
— it then auto-loads in every session:

```sh
ln -s "$(npm root)/@piotar/react-promise-bridge" ~/.claude/skills/react-promise-bridge
```

Either way Claude gains a `react-promise-bridge` skill that knows when and how to bridge a React
component to an awaitable promise.

## License

[MIT](./LICENSE) © Piotr Tarasiuk
