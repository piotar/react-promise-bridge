# react-promise-bridge

[![GitHub package.json version](https://img.shields.io/github/package-json/v/piotar/react-promise-bridge)](https://github.com/piotar/react-promise-bridge)
[![npm (scoped)](https://img.shields.io/npm/v/@piotar/react-promise-bridge)](https://www.npmjs.com/package/@piotar/react-promise-bridge)
![NPM](https://img.shields.io/npm/l/@piotar/react-promise-bridge)

A library that allows you to **easily manage components** that ultimately return a value as a `Promise`.

This is a simple wrapper that provided the `context` to solve the `Promise`.

This abstract component is designed for popups, modals, toasts, dynamic messages, notifications, etc.

**It is all up to you**.

## Installation

```sh
npm i @piotar/react-promise-bridge
```

## Features

- lightweight, no additional dependencies
- multiple instances and mulitple containers
- no additional properties, based on `context`
- different types of `Promise` entry creation strategies
- does not require additional changes to existing components
- support `AbortSignal`
- **works both inside and outside `React` components**


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
import React from 'react'
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { Container } from './SystemPromiseBridge';

ReactDOM.createRoot(document.getElementById('root')).render(
  <App>
    {/* ... */}
    <Container/>
  </App>
);

// or directly as DOM element
ReactDOM.createRoot(document.getElementById('modals')).render(<Container/>);

```

3. Use `usePromiseBridge` in component to `resolve` or `reject` `Promise`.

```javascript
// ./Confirm.tsx
import { usePromiseBridge } from '@piotar/react-promise-bridge';

export function Confirm(props: { message: string }): JSX.Element {
  const { resolve, reject } = usePromiseBridge<string>();

  return <div>
    <span>{props.message}</span>
    <button type='button' onClick={() => reject(new Error('custom exception'))}>cancel</button>
    <button type='button' onClick={() => resolve('some passed data')}>confirm</button>
  </div>
}
```

4. Use the invoke `Promise Bridge` function wherever you want.

Invoke promise bridge function to open component inside `React` component:

```javascript
// ./App.tsx
import { open } from './SystemPromiseBridge';

export function App({ children }: React.PropsWithChildren<unknown>): JSX.Element {
  const handleConfirm = async () => {
    try {
      const result = await open(<Confirm message='Some custom message' />);
      console.log('do something', result);
    } catch (error) {
      console.warn('closed', error);
    }
  };
  return (
    <div>
      <button onClick={handleConfirm}>open confirm</button>
      {children}
    </div>
  )
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
}, 1000)
```

Try it on:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/piotar/react-promise-bridge/examples/01_basic)

## Examples


TBD.