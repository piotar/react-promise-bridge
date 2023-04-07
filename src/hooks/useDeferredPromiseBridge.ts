import { useCallback, useMemo, useState } from 'react';
import { usePromiseBridge } from './usePromiseBridge';
import { PromiseContextType } from '../PromiseBridgeContext';
import { PromiseState } from '../constants/PromiseState';

export interface DeferrefPromiseBridge<T, R> extends PromiseContextType<T, R> {
    state: PromiseState;
    trigger(): void;
}

type DeferredRecord = [PromiseState, Function?];

const initialState: DeferredRecord = [PromiseState.Initial];

export function useDeferredPromiseBridge<T, R = any>(): DeferrefPromiseBridge<T, R> {
    const [[state, defer], setState] = useState<DeferredRecord>(initialState);
    const bridge = usePromiseBridge<T, R>();

    const resolve = useCallback(
        (data: T): void =>
            setState((prev) =>
                prev[0] === PromiseState.Initial ? [PromiseState.Pending, bridge.resolve.bind(null, data)] : prev,
            ),
        [bridge.resolve],
    );

    const reject = useCallback(
        (reason: R): void =>
            setState((prev) =>
                prev[0] === PromiseState.Initial ? [PromiseState.Pending, bridge.reject.bind(null, reason)] : prev,
            ),
        [bridge.reject],
    );

    const trigger = useCallback(() => {
        if (defer) {
            defer();
            setState([PromiseState.Settled]);
        }
    }, [defer]);

    return useMemo(
        () => ({
            state,
            signal: bridge.signal,
            resolve,
            reject,
            trigger,
        }),
        [state, bridge.signal, resolve, reject, trigger],
    );
}
