import { describe, expect, it, expectTypeOf } from 'vitest';
import { PromiseDefer } from './PromiseDefer';

describe('PromiseDefer', () => {
    it('should return correct interface', () => {
        const defer = new PromiseDefer();

        expect(defer).not.toBeInstanceOf(Promise);
        expect(defer.promise).toBeInstanceOf(Promise);
        expectTypeOf(defer.promise.finally).toBeFunction();
        expectTypeOf(defer.resolve).toBeFunction();
        expectTypeOf(defer.reject).toBeFunction();
    });

    it('should resolve promise', async () => {
        const defer = new PromiseDefer();
        defer.resolve('lorem');
        defer.reject(new Error());

        await expect(defer.promise).resolves.toBe('lorem');
    });

    it('should reject promise', async () => {
        const defer = new PromiseDefer();
        defer.reject(new Error());
        defer.resolve('lorem');

        await expect(defer.promise).rejects.toBeInstanceOf(Error);
    });
});
