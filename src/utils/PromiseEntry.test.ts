import { describe, expect, it, vi } from 'vitest';
import { EntryAbortedBeforeInitializeException } from '../exceptions/EntryAbortedBeforeInitializeException';
import { EntryAbortedByDisposeException } from '../exceptions/EntryAbortedByDisposeException';
import { EntryAbortedBySignalException } from '../exceptions/EntryAbortedBySignalException';
import { PromiseDefer } from './PromiseDefer';
import { PromiseEntry } from './PromiseEntry';

describe('PromiseEntry', () => {
    it('should return correct interface', () => {
        const instance = new PromiseEntry();

        expect(instance).toBeInstanceOf(PromiseDefer);
        expect(instance.entryId).toBeDefined();
        expect(instance.signal).toBeInstanceOf(AbortSignal);
    });

    it('should have always unique entry id', () => {
        const instanceA = new PromiseEntry();
        const instanceB = new PromiseEntry();

        expect(typeof instanceA.entryId).toBe('number');
        expect(typeof instanceB.entryId).toBe('number');
        expect(instanceA.entryId).not.toBe(instanceB.entryId);
    });

    it('should abort when signal will be send from outside abort singal', async () => {
        const controller = new AbortController();
        const instance = new PromiseEntry({
            signal: controller.signal,
        });

        controller.abort();
        instance.resolve('lorem');
        instance.reject(new Error());

        await expect(instance.promise).rejects.toBeInstanceOf(EntryAbortedBySignalException);
    });

    it('should abort when signal will be send from inside abort singal by dispatch event', async () => {
        const instance = new PromiseEntry();

        instance.signal.dispatchEvent(new Event('abort'));
        instance.resolve('lorem');
        instance.reject(new Error());

        await expect(instance.promise).rejects.toBeInstanceOf(EntryAbortedBySignalException);
    });

    it('should throw error when signal was aborted before initialize', () => {
        expect(
            () =>
                new PromiseEntry({
                    signal: AbortSignal.abort(),
                }),
        ).toThrowError(EntryAbortedBeforeInitializeException);
    });

    it('should send signal abort after promise fulfilled', async () => {
        const instance = new PromiseEntry();
        const callback = vi.fn();
        instance.signal.addEventListener('abort', callback);
        expect(callback).toHaveBeenCalledTimes(0);

        instance.resolve('lorem');
        await expect(instance.promise).resolves.toBe('lorem');
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0]).toBeInstanceOf(Event);
        expect(instance.signal.reason).toBeInstanceOf(EntryAbortedByDisposeException);
    });

    it('should dettach listener for abort signal after promise fulfilled', async () => {
        const { signal } = new AbortController();
        const addEventListener = vi.spyOn(signal, 'addEventListener');
        const removeEventListener = vi.spyOn(signal, 'removeEventListener');
        expect(addEventListener).toBeCalledTimes(0);
        expect(removeEventListener).toBeCalledTimes(0);

        const instance = new PromiseEntry({ signal });
        expect(addEventListener).toBeCalledTimes(1);
        expect(removeEventListener).toBeCalledTimes(0);

        instance.resolve('lorem');
        await expect(instance.promise).resolves.toBe('lorem');
        expect(addEventListener).toBeCalledTimes(1);
        expect(removeEventListener).toBeCalledTimes(1);
    });
});
