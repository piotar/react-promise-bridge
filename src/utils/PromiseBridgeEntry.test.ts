import React from 'react';
import { describe, expect, it } from 'vitest';
import { PromiseBridgeEntry } from './PromiseBridgeEntry';
import { PromiseEntry } from './PromiseEntry';

describe('PromiseBridgeEntry', () => {
    it('should return correct interface', () => {
        const instance = new PromiseBridgeEntry(React.createElement('div'), { id: 123 });

        expect(instance).toBeInstanceOf(PromiseEntry);
        expect(instance.id).toBe(123);
        expect(instance.signal).toBeInstanceOf(AbortSignal);
        expect(React.isValidElement(instance.component)).toBe(true);
    });
});
