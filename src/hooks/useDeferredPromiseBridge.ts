import { createElement, useMemo, useRef, useState } from 'react';
import { usePromiseBridge } from './usePromiseBridge';
import { PromiseContextType } from '../PromiseBridgeContext';
import { PromiseState } from '../constants/PromiseState';
import { PromiseContextProvider } from '../components/PromiseContextProvider';

export interface DeferredPromiseBridge<T, R> extends PromiseContextType<T, R> {
    state: PromiseState;
    trigger(): void;
    Provider: typeof PromiseContextProvider;
}

type DeferredRecord = [PromiseState, Function?];

const initialState: DeferredRecord = [PromiseState.Initial];

export function useDeferredPromiseBridge<T, R = any>(): DeferredPromiseBridge<T, R> {
    const bridge = usePromiseBridge<T, R>();
    const [state, setState] = useState<DeferredRecord>(initialState);
    const stateRef = useRef(state);
    stateRef.current = state;

    const api = useMemo<Omit<DeferredPromiseBridge<T, R>, 'state' | 'Provider'>>(
        () => ({
            signal: bridge.signal,
            resolve: (data) =>
                setState((prev) =>
                    prev[0] === PromiseState.Initial ? [PromiseState.Pending, bridge.resolve.bind(null, data)] : prev,
                ),
            reject: (reason) =>
                setState((prev) =>
                    prev[0] === PromiseState.Initial ? [PromiseState.Pending, bridge.reject.bind(null, reason)] : prev,
                ),
            trigger: () => {
                const [, defer] = stateRef.current;
                if (defer) {
                    defer();
                    setState([PromiseState.Settled]);
                }
            },
        }),
        [bridge, stateRef],
    );

    return useMemo<DeferredPromiseBridge<T, R>>(
        () => ({
            ...api,
            state: state[0],
            Provider: ({ children }) => createElement(PromiseContextProvider, api, children),
        }),
        [state, api],
    );
}
