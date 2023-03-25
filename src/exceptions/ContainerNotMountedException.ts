import { PromiseBridgeException } from './PromiseBridgeException';

export class ContainerNotMountedException extends PromiseBridgeException {
    constructor() {
        super('Container Promise Bridge not mounted');
    }
}
