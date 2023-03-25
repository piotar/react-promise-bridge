import { PromiseBridgeException } from './PromiseBridgeException';

export class MissingEntryIdException extends PromiseBridgeException {
    constructor() {
        super('The selected strategy requires an id');
    }
}
