import { StrictMode, createElement } from 'react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { render, renderHook } from '@testing-library/react';
import { useFactoryPromiseBridge } from './useFactoryPromiseBridge';

describe('useFactoryPromiseBridge', () => {
    it('should return Promise Bridge instance', () => {
        const { result, rerender } = renderHook(useFactoryPromiseBridge, {
            wrapper: StrictMode,
        });

        const [Container, opener] = result.current;
        expectTypeOf(opener).toBeFunction();

        const { container } = render(createElement(Container));
        expect(container.children.length).toBe(0);

        rerender();
        expect(Container).toBe(result.current[0]);
        expect(opener).toBe(result.current[1]);

        // A new options object that is value-equal must NOT rebuild the bridge.
        rerender({});
        expect(Container).toBe(result.current[0]);
        expect(opener).toBe(result.current[1]);

        // Changing an actual option value rebuilds the bridge.
        rerender({ isMultiContainer: true });
        expect(Container).not.toBe(result.current[0]);
        expect(opener).not.toBe(result.current[1]);
    });
});
