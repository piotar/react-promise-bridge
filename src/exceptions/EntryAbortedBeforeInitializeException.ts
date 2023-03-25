import { PromiseBridgeException } from './PromiseBridgeException';

export class EntryAbortedBeforeInitializeException extends PromiseBridgeException {
    constructor() {
        super('Entry aborted before initialize');
    }
}
