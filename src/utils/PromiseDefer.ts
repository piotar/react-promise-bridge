export class PromiseDefer<T, R> {
    public promise: Promise<T>;

    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    public resolve(value: T | PromiseLike<T>): void {
        throw new Error('Method not implemented');
    }

    public reject(reason?: R): void {
        throw new Error('Method not implemented');
    }
}
