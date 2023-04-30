import React, { createElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { useDeferredPromiseBridge } from './useDeferredPromiseBridge';
import { PromiseBridgeContext } from '../PromiseBridgeContext';
import { PromiseContextType } from '../PromiseBridgeContext';
import { PromiseState } from '../constants/PromiseState';
import { usePromiseBridge } from './usePromiseBridge';

describe('useDeferredPromiseBridge', () => {
    it('should resolve context', () => {
        const value = {
            resolve: vi.fn(),
            reject: vi.fn(),
            signal: new AbortController().signal,
        } satisfies PromiseContextType<unknown, unknown>;

        const { result, rerender } = renderHook(useDeferredPromiseBridge, {
            wrapper: ({ children }) => createElement(PromiseBridgeContext.Provider, { value }, children),
        });

        expect(value.resolve).not.toHaveBeenCalled();
        expect(value.reject).not.toHaveBeenCalled();

        expect(result.current.state).toBe(PromiseState.Initial);
        expect(result.current.signal).toBe(value.signal);

        result.current.resolve('some data');
        rerender();

        result.current.resolve('some another data');
        rerender();

        expect(result.current.state).toBe(PromiseState.Pending);
        expect(value.resolve).not.toHaveBeenCalled();
        expect(value.reject).not.toHaveBeenCalled();

        result.current.trigger();
        rerender();
        expect(result.current.state).toBe(PromiseState.Settled);
        expect(value.resolve).toHaveBeenCalledOnce();
        expect(value.reject).not.toHaveBeenCalled();
        expect(value.resolve.mock.calls[0][0]).toEqual('some data');
    });

    it('should reject context', () => {
        const value = {
            resolve: vi.fn(),
            reject: vi.fn(),
            signal: new AbortController().signal,
        } satisfies PromiseContextType<unknown, unknown>;

        const { result, rerender } = renderHook(useDeferredPromiseBridge, {
            wrapper: ({ children }) => createElement(PromiseBridgeContext.Provider, { value }, children),
        });

        expect(value.resolve).not.toHaveBeenCalled();
        expect(value.reject).not.toHaveBeenCalled();

        expect(result.current.state).toBe(PromiseState.Initial);
        expect(result.current.signal).toBe(value.signal);

        result.current.reject(new SyntaxError());
        rerender();

        result.current.reject(new TypeError());
        rerender();

        expect(result.current.state).toBe(PromiseState.Pending);
        expect(value.resolve).not.toHaveBeenCalled();
        expect(value.reject).not.toHaveBeenCalled();

        result.current.trigger();
        rerender();
        expect(result.current.state).toBe(PromiseState.Settled);
        expect(value.resolve).not.toHaveBeenCalled();
        expect(value.reject).toHaveBeenCalledOnce();
        expect(value.reject.mock.calls[0][0]).instanceOf(SyntaxError);
    });

    it('should use new Provider to usePromiseBridge using deferred mechanism', () => {
        function MockComponent() {
            const { resolve } = usePromiseBridge();
            return React.createElement('button', {
                onClick() {
                    resolve('lorem');
                },
            });
        }

        const value = {
            resolve: vi.fn(),
            reject: vi.fn(),
            signal: new AbortController().signal,
        } satisfies PromiseContextType<unknown, unknown>;

        const { result } = renderHook(useDeferredPromiseBridge, {
            wrapper: ({ children }) => createElement(PromiseBridgeContext.Provider, { value }, children),
        });

        expect(value.resolve).not.toHaveBeenCalled();
        expect(value.reject).not.toHaveBeenCalled();

        render(React.createElement(result.current.Provider, undefined, [createElement(MockComponent, { key: 1 })]));
        fireEvent.click(screen.getByRole('button'));
        result.current.trigger();
        expect(value.resolve).toHaveBeenCalled();
        expect(value.reject).not.toHaveBeenCalledOnce();
    });
});
