import { PromiseBridgeException } from './PromiseBridgeException';

export class EntryAbortedByDisposeException extends PromiseBridgeException {
    constructor() {
        super('Entry aborted by dispose');
    }
}
