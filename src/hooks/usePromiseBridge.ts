import { useContext } from 'react';
import { PromiseBridgeException } from '../exceptions/PromiseBridgeException';
import { PromiseBridgeContext, PromiseContextType } from '../PromiseBridgeContext';

export function usePromiseBridge<T, R = any>(): PromiseContextType<T, R> {
    const context = useContext(PromiseBridgeContext);
    if (context) {
        return context;
    }
    throw new PromiseBridgeException('Missing Promise Bridge context');
}
