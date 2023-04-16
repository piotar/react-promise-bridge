import { StrictMode } from 'react';
import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDisposePromiseBridge } from './useDisposePromiseBridge';

describe('useDisposePromiseBridge', () => {
    it('should return AbortController instance', () => {
        const { result, rerender } = renderHook(useDisposePromiseBridge);
        const controller = result.current;
        expect(result.current).instanceOf(AbortController);
        rerender();
        expect(result.current).toBe(controller);
    });

    it('should return AbortController instance using strict mode', () => {
        const { result, rerender } = renderHook(useDisposePromiseBridge, {
            wrapper: StrictMode,
        });
        const controller = result.current;
        expect(result.current).instanceOf(AbortController);
        rerender();
        expect(result.current).toBe(controller);
    });
});
