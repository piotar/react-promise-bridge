import { PromiseBridgeException } from './PromiseBridgeException';

export class EntryRecreateException extends PromiseBridgeException {
    constructor() {
        super('Entry was recreated');
    }
}
