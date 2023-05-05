import { useMemo } from 'react';
import { PromiseBridge, PromiseBridgeOptions } from '../utils/PromiseBridge';

export function useFactoryPromiseBridge(
    options?: Partial<PromiseBridgeOptions>,
): ReturnType<(typeof PromiseBridge)['create']> {
    return useMemo(() => PromiseBridge.create(options), [options]);
}
