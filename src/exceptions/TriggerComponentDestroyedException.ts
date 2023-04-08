import { PromiseBridgeException } from './PromiseBridgeException';

export class TriggerComponentDestroyedException extends PromiseBridgeException {
    constructor() {
        super('Trigger component was destroyed');
    }
}
