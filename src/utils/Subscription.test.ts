import { describe, expect, it, vi } from 'vitest';
import { Subscription } from './Subscription';

describe('Subscription', () => {
    it('should attach callback as subscribe and dispose', () => {
        const instance = new Subscription<{ test: unknown }>();
        const callback = vi.fn();
        expect(instance.count('test')).toEqual(0);

        const disposeA = instance.subscribe('test', callback);
        const disposeB = instance.subscribe('test', callback);
        expect(instance.count('test')).toEqual(2);

        disposeA();
        expect(instance.count('test')).toEqual(1);

        disposeB();
        expect(instance.count('test')).toEqual(0);
        expect(callback).toHaveBeenCalledTimes(0);
    });

    it('should run callback from subscribe after dispatch', () => {
        const instance = new Subscription<{ test?: number }>();
        const callback = vi.fn();
        instance.subscribe('test', callback);
        expect(callback).toHaveBeenCalledTimes(0);

        instance.dispatch('test');
        expect(callback).toHaveBeenCalledTimes(1);

        instance.dispatch('test', 123);
        instance.dispatch('test', 321);
        expect(callback).toHaveBeenCalledTimes(3);
    });
});
