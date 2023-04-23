import { PromiseBridgeException } from './PromiseBridgeException';

export class ContainerDestroyedException extends PromiseBridgeException {
    constructor() {
        super('Container Promise Bridge was destroyed');
    }
}
