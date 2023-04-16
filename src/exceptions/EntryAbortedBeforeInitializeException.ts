import { PromiseBridgeException } from './PromiseBridgeException';

export class EntryAbortedBeforeInitializeException extends PromiseBridgeException {
    constructor(cause?: ErrorOptions['cause']) {
        super('Entry aborted before initialize', { cause });
    }
}
