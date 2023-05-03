import { createElement, useCallback, useMemo, useRef, useState } from 'react';
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

    const resolve = useCallback<(typeof bridge)['resolve']>(
        (data) =>
            setState((prev) =>
                prev[0] === PromiseState.Initial ? [PromiseState.Pending, bridge.resolve.bind(null, data)] : prev,
            ),
        [bridge.resolve],
    );

    const reject = useCallback<(typeof bridge)['reject']>(
        (reason) =>
            setState((prev) =>
                prev[0] === PromiseState.Initial ? [PromiseState.Pending, bridge.reject.bind(null, reason)] : prev,
            ),
        [bridge.reject],
    );

    const trigger = useCallback(() => {
        const [, defer] = stateRef.current;
        if (defer) {
            defer();
            setState([PromiseState.Settled]);
        }
    }, [stateRef]);

    const Provider = useCallback<typeof PromiseContextProvider>(
        ({ children }) =>
            createElement(
                PromiseContextProvider,
                {
                    reject,
                    resolve,
                    signal: bridge.signal,
                },
                children,
            ),
        [reject, resolve, bridge.signal],
    );

    return useMemo<DeferredPromiseBridge<T, R>>(
        () => ({
            state: state[0],
            signal: bridge.signal,
            resolve,
            reject,
            trigger,
            Provider,
        }),
        [state, bridge.signal, resolve, reject, trigger, Provider],
    );
}
