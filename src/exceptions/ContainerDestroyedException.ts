import { PromiseBridgeException } from './PromiseBridgeException';

export class ContainerDestroyedException extends PromiseBridgeException {
    constructor() {
        super('Container promise bridge was destroyed');
    }
}
