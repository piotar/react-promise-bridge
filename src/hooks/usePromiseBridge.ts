import { useContext } from 'react';
import { PromiseBridgeContext, PromiseContextType } from '../PromiseBridgeContext';

export function usePromiseBridge<T, R = any>(): PromiseContextType<T, R> {
    const context = useContext(PromiseBridgeContext);
    if (context) {
        return context;
    }
    throw new Error('Missing Promise Bridge context');
}
