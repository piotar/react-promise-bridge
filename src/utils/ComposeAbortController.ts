import { AbortSignalStrategy } from '../constants/AbortSignalStrategy';
import { ExternalAbortSignalException } from '../exceptions/ExternalAbortSignalException';

export interface ComposeAbortControllerOptions {
    strategy?: AbortSignalStrategy;
}

export class ComposeAbortController extends AbortController {
    protected readonly options: ComposeAbortControllerOptions;

    constructor(protected signals: AbortSignal[] = [], options?: ComposeAbortControllerOptions) {
        super();
        this.options = {
            strategy: AbortSignalStrategy.Any,
            ...options,
        };

        this.handleExternalAbortSignal = this.handleExternalAbortSignal.bind(this);
        this.signals.forEach((signal) =>
            signal.addEventListener('abort', this.handleExternalAbortSignal, { once: true }),
        );
        this.handleExternalAbortSignal();
    }

    protected handleExternalAbortSignal(): void {
        const aborted = this.signals.filter((signal) => signal.aborted);
        if (this.hasAbortedSignal(aborted)) {
            this.abort(new ExternalAbortSignalException(aborted.map((signal) => signal.reason)));
        }
    }

    protected hasAbortedSignal(aborted: AbortSignal[]): boolean {
        if (this.options.strategy === AbortSignalStrategy.Any) {
            return aborted.length > 0;
        }
        return aborted.length > 0 && this.signals.length === aborted.length;
    }

    public override abort(reason?: any): void;
    public override abort(): void;
    public override abort(reason?: unknown): void {
        super.abort(reason);
        this.dispose();
    }

    protected dispose(): void {
        this.signals.forEach((signal) => signal.removeEventListener('abort', this.handleExternalAbortSignal));
    }
}
