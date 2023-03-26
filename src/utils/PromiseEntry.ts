import { EntryAbortedBeforeInitializeException } from '../exceptions/EntryAbortedBeforeInitializeException';
import { EntryAbortedByDisposeException } from '../exceptions/EntryAbortedByDisposeException';
import { EntryAbortedBySignalException } from '../exceptions/EntryAbortedBySignalException';
import { PromiseDefer } from './PromiseDefer';
import { UniqueId } from './UniqueId';

export interface PromiseEntryOptions {
    signal?: AbortSignal;
}

export class PromiseEntry<T> extends PromiseDefer<T, unknown> {
    protected static readonly counter = new UniqueId();

    public readonly entryId = PromiseEntry.counter.generate();
    protected readonly abortController: AbortController = new AbortController();
    private readonly dettachAbortSignal?: () => void;
    private readonly dettachInternalAbortSignal?: () => void;

    constructor(options?: PromiseEntryOptions) {
        super();
        this.dettachAbortSignal = this.attachAbortSignal(options?.signal);
        this.dettachInternalAbortSignal = this.attachAbortSignal(this.signal);
        this.promise = this.promise.finally(this.dispose.bind(this));
    }

    public get signal(): AbortSignal {
        return this.abortController.signal;
    }

    private attachAbortSignal(signal: AbortSignal | undefined): (() => void) | undefined {
        if (!signal) {
            return undefined;
        }
        if (signal.aborted) {
            throw new EntryAbortedBeforeInitializeException();
        }

        const callback = this.reject.bind(this, new EntryAbortedBySignalException());
        signal.addEventListener('abort', callback, { once: true });
        return () => signal.removeEventListener('abort', callback);
    }

    protected dispose(): void {
        this.dettachAbortSignal?.();
        this.dettachInternalAbortSignal?.();
        if (!this.abortController.signal.aborted) {
            this.abortController.abort(new EntryAbortedByDisposeException());
        }
    }
}
