import { EntryAbortedBeforeInitializeException } from '../exceptions/EntryAbortedBeforeInitializeException';
import { EntryAbortedByDisposeException } from '../exceptions/EntryAbortedByDisposeException';
import { EntryAbortedBySignalException } from '../exceptions/EntryAbortedBySignalException';
import { ComposeAbortController } from './ComposeAbortController';
import { PromiseDefer } from './PromiseDefer';
import { UniqueId } from './UniqueId';

export interface PromiseEntryOptions {
    signal?: AbortSignal;
}

export class PromiseEntry<T> extends PromiseDefer<T, unknown> {
    protected static readonly counter = new UniqueId();

    public readonly entryId = PromiseEntry.counter.generate();
    protected readonly abortController: ComposeAbortController;

    constructor(options?: PromiseEntryOptions) {
        super();
        this.abortController = new ComposeAbortController(options?.signal ? [options.signal] : []);

        if (this.signal.aborted) {
            this.reject(new EntryAbortedBeforeInitializeException(this.signal.reason));
        } else {
            this.handleAbortSignal = this.handleAbortSignal.bind(this);
            this.signal.addEventListener('abort', this.handleAbortSignal, { once: true });
            this.promise = this.promise.finally(this.dispose.bind(this));
        }
    }

    public get signal(): AbortSignal {
        return this.abortController.signal;
    }

    private handleAbortSignal(): void {
        this.reject(new EntryAbortedBySignalException(this.signal.reason));
    }

    protected dispose(): void {
        this.signal.removeEventListener('abort', this.handleAbortSignal);
        if (!this.signal.aborted) {
            this.abortController.abort(new EntryAbortedByDisposeException());
        }
    }
}
