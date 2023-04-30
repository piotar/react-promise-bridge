import { StrictMode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDisposePromiseBridge } from './useDisposePromiseBridge';
import { TriggerComponentDestroyedException } from '../exceptions/TriggerComponentDestroyedException';
import { ExternalAbortSignalException } from '../exceptions/ExternalAbortSignalException';

describe('useDisposePromiseBridge', () => {
    it('should return AbortController instance', () => {
        const { result, rerender } = renderHook(useDisposePromiseBridge);
        const controller = result.current;
        expect(result.current).instanceOf(AbortController);
        rerender();
        expect(result.current).toBe(controller);
        expect(result.current.signal.reason).toBeUndefined();
    });

    it('should return AbortController instance using strict mode', () => {
        const { result, rerender } = renderHook(useDisposePromiseBridge, {
            wrapper: StrictMode,
        });
        const controller = result.current;
        expect(result.current).instanceOf(AbortController);
        rerender();
        expect(result.current).toBe(controller);
        expect(result.current.signal.reason).toBeUndefined();
    });

    it('should return AbortController instance and abort singal after unmount', () => {
        const { result, rerender, unmount } = renderHook(useDisposePromiseBridge, {
            wrapper: StrictMode,
        });
        const controller = result.current;
        expect(result.current.signal.reason).toBeUndefined();
        rerender();
        expect(result.current).toBe(controller);
        unmount();
        expect(result.current).toBe(controller);
        expect(result.current.signal.reason).instanceOf(TriggerComponentDestroyedException);
    });

    it('should return AbortController instance with Aborted signal by external signals', () => {
        const signals = [AbortSignal.abort()];
        const { result, rerender } = renderHook(useDisposePromiseBridge, {
            wrapper: StrictMode,
            initialProps: signals,
        });
        const controller = result.current;
        expect(result.current.signal.reason).instanceOf(ExternalAbortSignalException);
        rerender(signals);
        expect(result.current).toBe(controller);
        expect(result.current.signal.reason).instanceOf(ExternalAbortSignalException);
    });

    it('should return AbortController instance with new instance after change signals', () => {
        const signals = [AbortSignal.abort()];
        const { result, rerender } = renderHook(useDisposePromiseBridge, {
            wrapper: StrictMode,
            initialProps: signals,
        });
        const controller = result.current;
        expect(result.current.signal.reason).instanceOf(ExternalAbortSignalException);
        rerender([]);
        expect(result.current).not.toBe(controller);
        expect(result.current.signal.reason).toBeUndefined();
    });

    it('should return AbortController instance using abort external signal', () => {
        const externalController = new AbortController();
        const signals = [externalController.signal];
        const { result, rerender, unmount } = renderHook(useDisposePromiseBridge, {
            wrapper: StrictMode,
            initialProps: signals,
        });
        const controller = result.current;
        expect(result.current).instanceOf(AbortController);
        rerender(signals);
        expect(result.current).toBe(controller);
        externalController.abort();
        expect(result.current.signal.reason).instanceOf(ExternalAbortSignalException);
        unmount();
        expect(result.current.signal.reason).instanceOf(ExternalAbortSignalException);
    });

    it('should call abort handler from instance AbortController hook', () => {
        const { result, rerender, unmount } = renderHook(useDisposePromiseBridge, {
            wrapper: StrictMode,
        });
        const handleAbort = vi.fn();
        const controller = result.current;
        controller.signal.addEventListener('abort', handleAbort);
        expect(result.current).instanceOf(AbortController);
        expect(result.current).toBe(controller);

        const customError = new Error();
        controller.abort(customError);
        expect(handleAbort).toHaveBeenCalledOnce();
        expect(result.current.signal.reason).toBe(customError);

        rerender();
        expect(result.current).not.toBe(controller);
        expect(result.current.signal.reason).toBeUndefined();

        rerender();
        unmount();
        expect(result.current.signal.reason).instanceOf(TriggerComponentDestroyedException);
    });
});
