import { PropsWithChildren, useMemo } from 'react';
import { PromiseBridgeContext, PromiseContextType } from '../PromiseBridgeContext';

interface PromiseContextProviderProps<T, R> {
    signal: AbortSignal;
    resolve(data: T): void;
    reject(reason: R): void;
}

export function PromiseContextProvider<T, R>({
    resolve,
    reject,
    signal,
    children,
}: PropsWithChildren<PromiseContextProviderProps<T, R>>): JSX.Element {
    const contextValue = useMemo<PromiseContextType<T, R>>(
        () => ({
            resolve,
            reject,
            signal,
        }),
        [resolve, reject, signal],
    );
    return <PromiseBridgeContext.Provider value={contextValue}>{children}</PromiseBridgeContext.Provider>;
}
