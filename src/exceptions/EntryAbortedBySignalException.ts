import { PromiseBridgeException } from './PromiseBridgeException';

export class EntryAbortedBySignalException extends PromiseBridgeException {
    constructor() {
        super('Entry aborted by signal');
    }
}
