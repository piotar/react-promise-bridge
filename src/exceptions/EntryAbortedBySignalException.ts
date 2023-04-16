import { PromiseBridgeException } from './PromiseBridgeException';

export class EntryAbortedBySignalException extends PromiseBridgeException {
    constructor(cause?: ErrorOptions['cause']) {
        super('Entry aborted by signal', { cause });
    }
}
