import { PromiseBridgeException } from './PromiseBridgeException';

export class MissingEntryIdException extends PromiseBridgeException {
    constructor() {
        super('The selected entry strategy requires an id');
    }
}
