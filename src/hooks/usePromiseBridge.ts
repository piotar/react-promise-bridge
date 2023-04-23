import { useContext } from 'react';
import { PromiseBridgeContext, PromiseContextType } from '../PromiseBridgeContext';
import { MissingContextException } from '../exceptions/MissingContextException';

export function usePromiseBridge<T, R = any>(): PromiseContextType<T, R> {
    const context = useContext(PromiseBridgeContext);
    if (context) {
        return context;
    }
    throw new MissingContextException();
}
