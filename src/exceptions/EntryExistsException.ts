import { PromiseBridgeException } from './PromiseBridgeException';

export class EntryExistsException extends PromiseBridgeException {
    constructor() {
        super('Entry with specify id exists');
    }
}
