# react-promise-bridge

[![GitHub package.json version](https://img.shields.io/github/package-json/v/piotar/react-promise-bridge)](https://github.com/piotar/react-promise-bridge)
[![npm (scoped)](https://img.shields.io/npm/v/@piotar/react-promise-bridge)](https://www.npmjs.com/package/@piotar/react-promise-bridge)
![NPM](https://img.shields.io/npm/l/@piotar/react-promise-bridge)
![Coverage](https://github.com/piotar/react-promise-bridge/raw/gh-pages/badge.svg)

A library that allows you to **easily manage components** that ultimately return a value as a `Promise`.

This is a simple wrapper that provided the `context` to resolve or reject the `Promise`.

This abstract component is designed for dialogs, popups, modals, toasts, dynamic messages, notifications, etc.

**It is all up to you**.

## Installation

```sh
npm install @piotar/react-promise-bridge
```

## Features

- lightweight, **no additional dependencies**
- multiple instances and mulitple containers
- nested containers and nested entries
- containers can be placed **anywhere** in other application contexts
- no additional properties, based on `context`
- different types of strategies to create a `Promise` entry
- does not require additional changes to existing components, just use the context of the `Promise Bridge`
- support `AbortSignal`
- **function call to open a bridge, works both inside and outside `React` components**

## How to use

1. Import and create container with invoke function of `Promise Bridge`

```javascript
// ./SystemPromiseBridge.tsx
import { PromiseBridge } from '@piotar/react-promise-bridge';

// the name of the container and function depends on you
export const [Container, open] = PromiseBridge.create();
```

2. Put Container of `Promise Bridge` wherever you want in the dom `React` or mount in directly on `DOM`

```javascript
// ./main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { Container } from './SystemPromiseBridge';

ReactDOM.createRoot(document.getElementById('root')).render(
    <App>
        {/* ... */}
        <Container />
    </App>,
);

// or directly as DOM element
ReactDOM.createRoot(document.getElementById('modals')).render(<Container />);
```

3. Use `usePromiseBridge` in component to `resolve` or `reject` `Promise`.

```javascript
// ./Confirm.tsx
import { usePromiseBridge } from '@piotar/react-promise-bridge';

interface ConfirmProps {
    header?: string;
    message: string;
}

export function Confirm({ header, message }: ConfirmProps): JSX.Element {
    const { resolve, reject } = usePromiseBridge<boolean>();

    return (
        <dialog open={true}>
            {header ? <header>{header}</header> : null}
            <p>{message}</p>
            <footer>
                <button type="button" onClick={() => reject(new Error('Canceled'))}>
                    Cancel
                </button>
                <button type="button" onClick={() => resolve(true)}>
                    Confirm
                </button>
            </footer>
        </dialog>
    );
}
```

4. Use the invoke `Promise Bridge` function wherever you want.

Invoke promise bridge function to open component inside `React` component:

```javascript
// ./App.tsx
import { open } from './SystemPromiseBridge';

export function App({ children }: React.PropsWithChildren<unknown>): JSX.Element {
    const handleConfirmClick = async () => {
        try {
            await open(<Confirm header="Confirmation" message="Some custom message" />);
            // handle confirm
            console.log('confirmed');
        } catch (error) {
            console.warn(error);
        }
    };

    return (
        <div>
            <button type="button" onClick={handleConfirmClick}>
                Open confirm modal
            </button>
            {/* ... */}
        </div>
    );
}
```

Invoke promise bridge function to open component outside `React`:

```javascript
import { open } from './SystemPromiseBridge';

setTimeout(async () => {
    try {
        const result = await open(<Confirm message="my custom message" />);
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}, 1000);
```

Try it on:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/01_basic?file=src/App.tsx)

## Hooks

### `usePromiseBridge`

The main hook for resolving or rejecting `Promise`.

```javascript
const { resolve, reject, signal } = usePromiseBridge<ResolveType, RejectType>();
```

[Example in StackBlitz](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/01_basic?file=src/components/ColorPicker.tsx:L12)

### `useDeferredPromiseBridge`

A hook based on `usePromiseBridge`. 

The hook is designed to manage animation.

The hook allows you to defer the fulfilled `Promise` and release it by calling a `trigger` function.

```javascript
const {
    resolve,
    reject,
    signal,
    state,
    trigger,
    Provider,
} = useDeferredPromiseBridge<ResolveType, RejectType>();
```

[Example in StackBlitz](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/02_animation?file=src/components/ColorPicker.tsx:L12)

### `useDisposePromiseBridge`

The helper hook is designed to help create an abort controller to reject `Promise` after the trigger component is destroyed.

```javascript
const abortController = useDisposePromiseBridge(signals);
```

[Example in StackBlitz](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/08_destroy_component?file=src/components/SomeChild.tsx:L8)

### `useFactoryPromiseBridge`

A helper hook for creating a new `Promise Bridge` instance for dynamic React components.

```javascript
const [Container, opener] = useFactoryPromiseBridge(options);
```

[Example in StackBlitz](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/i03_antd?file=src/components/Drawer.tsx:L32)

## Examples

| Repository example | Open in StackBlitz |
| --- | --- |
| [#01 Basic](/examples/01_basic/) | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/01_basic?file=src/App.tsx) |
| [#02 Animation](/examples//02_animation/) | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/02_animation?file=src/App.tsx) |
| [#03 Animation with classes](/examples//03_animation_classname/) | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/03_animation_classname?file=src/App.tsx) |
| [#04 Abort controller](/examples//04_abort_controller/) | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/piotar/react-promise-bridge/tree/main/examples/04_abort_controller?file=src/App.tsx) |
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