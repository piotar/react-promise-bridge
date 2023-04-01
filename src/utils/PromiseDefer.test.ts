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

    it('should throw exception when Promise is override or construct will override', () => {
        // This case omit constructor to create Promise instance in PromiseDefer
        const OverridePromiseDefer = function () {} as unknown as new () => PromiseDefer<any, any>;
        OverridePromiseDefer.prototype = PromiseDefer.prototype;

        const defer = new OverridePromiseDefer();

        expect(defer).not.toBeInstanceOf(Promise);
        expect(defer.promise).toBeUndefined();
        expectTypeOf(defer.resolve).toBeFunction();
        expectTypeOf(defer.reject).toBeFunction();
        expect(() => defer.resolve('lorem')).toThrowError(Error);
        expect(() => defer.reject('lorem')).toThrowError(Error);
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
