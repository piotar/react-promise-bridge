import { AbortSignalException } from './AbortSignalException';

export class ExternalAbortSignalException extends AbortSignalException {
    constructor(cause?: AbortSignal['reason'][]) {
        super('Aborted by external AbortSignal', { cause });
    }
}
