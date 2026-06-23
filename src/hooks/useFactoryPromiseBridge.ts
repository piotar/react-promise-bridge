import { useMemo } from 'react';
import { PromiseBridge, PromiseBridgeOptions } from '../utils/PromiseBridge';

export function useFactoryPromiseBridge(
    options?: Partial<PromiseBridgeOptions>,
): ReturnType<(typeof PromiseBridge)['create']> {
    // Memoize by the option values, not by the `options` object identity, so passing an inline
    // object (`useFactoryPromiseBridge({ ... })`) does not rebuild the bridge on every render
    // (which would remount the Container and reject every pending entry).
    return useMemo(() => PromiseBridge.create(options), [options?.isMultiContainer, options?.container]);
}
