export class AbortSignalException extends Error {
    constructor(message?: string, options?: ErrorOptions) {
        super(message, options);
        this.name = 'AbortSignalException';
    }
}
