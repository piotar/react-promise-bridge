export class PromiseBridgeException extends Error {
    constructor(message?: string, options?: ErrorOptions) {
        super(message, options);
        this.name = 'PromiseBridgeException';
    }
}
