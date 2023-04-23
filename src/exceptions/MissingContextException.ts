import { PromiseBridgeException } from './PromiseBridgeException';

export class MissingContextException extends PromiseBridgeException {
    constructor() {
        super('Missing Promise Bridge context');
    }
}
