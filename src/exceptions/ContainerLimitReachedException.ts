import { PromiseBridgeException } from './PromiseBridgeException';

export class ContainerLimitReachedException extends PromiseBridgeException {
    constructor() {
        super('The container can only be used once');
    }
}
