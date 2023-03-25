import { createContext } from 'react';

export interface PromiseContextType<T, R> {
    resolve(value?: T): void;
    reject(reason?: R): void;
    signal: AbortSignal;
}

export const PromiseBridgeContext = createContext<PromiseContextType<any, any> | null>(null);
