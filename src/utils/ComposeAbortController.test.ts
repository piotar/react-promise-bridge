import { describe, expect, it, vi } from 'vitest';
import { ComposeAbortController } from './ComposeAbortController';
import { ExternalAbortSignalException } from '../exceptions/ExternalAbortSignalException';
import { AbortSignalStrategy } from '../constants/AbortSignalStrategy';

describe('ComposeAbortController', () => {
    it('should works like AbortController', () => {
        const instance = new ComposeAbortController();

        const handleAbort = vi.fn();
        instance.signal.addEventListener('abort', handleAbort);
        expect(instance.signal.aborted).toBeFalsy();
        expect(handleAbort).toHaveBeenCalledTimes(0);

        instance.abort(new Error());
        expect(instance.signal.aborted).toBeTruthy();
        expect(instance.signal.reason).not.toBeInstanceOf(ExternalAbortSignalException);
        expect(handleAbort).toHaveBeenCalledTimes(1);
    });

    it('should abort after some external AbortSignal was aborted', () => {
        const externals = [new AbortController(), new AbortController()];
        const instance = new ComposeAbortController(externals.map((external) => external.signal));

        const handleAbort = vi.fn();
        instance.signal.addEventListener('abort', handleAbort);
        expect(instance.signal.aborted).toBeFalsy();
        expect(handleAbort).toHaveBeenCalledTimes(0);

        externals[0].abort(new Error());
        expect(instance.signal.aborted).toBeTruthy();
        expect(instance.signal.reason).toBeInstanceOf(ExternalAbortSignalException);
        expect(handleAbort).toHaveBeenCalledTimes(1);
    });

    it('should abort after every external AbortSignal was aborted', () => {
        const externals = [new AbortController(), new AbortController()];
        const instance = new ComposeAbortController(
            externals.map((external) => external.signal),
            {
                strategy: AbortSignalStrategy.Every,
            },
        );

        const handleAbort = vi.fn();
        instance.signal.addEventListener('abort', handleAbort);
        expect(instance.signal.aborted).toBeFalsy();
        expect(handleAbort).toHaveBeenCalledTimes(0);

        externals[0].abort(new Error());
        expect(instance.signal.aborted).toBeFalsy();

        externals[1].abort(new Error());
        expect(instance.signal.aborted).toBeTruthy();
        expect(instance.signal.reason).toBeInstanceOf(ExternalAbortSignalException);
        expect(handleAbort).toHaveBeenCalledTimes(1);
    });

    it('should not abort when AbortSignal was aborted by dispatchEvent', () => {
        const instance = new ComposeAbortController();

        expect(instance.signal.aborted).toBeFalsy();
        instance.signal.dispatchEvent(new Event('abort'));
        expect(instance.signal.aborted).toBeFalsy();

        instance.abort(new SyntaxError());
        expect(instance.signal.reason).toBeInstanceOf(SyntaxError);
    });
});
