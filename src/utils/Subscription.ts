interface ListenerRecord<K = any, T = any> {
    name: K;
    listener: (data: T) => void;
}

export interface SubscriptionActions {}

export class Subscription<A extends SubscriptionActions = SubscriptionActions> {
    private listeners: Array<ListenerRecord<keyof A>> = [];

    public subscribe<K extends keyof A>(name: K, listener: ListenerRecord<K, A[K]>['listener']) {
        const record = { name, listener };
        this.listeners.push(record);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== record);
        };
    }

    public dispatch<K extends keyof A>(name: A[K] extends Object ? never : K): void;
    public dispatch<K extends keyof A>(name: K, data: A[K]): void;
    public dispatch<K extends keyof A>(name: K, data?: A[K]): void {
        for (const record of this.listeners) {
            if (record.name === name) {
                record.listener(data);
            }
        }
    }

    public count(name: keyof A) {
        return this.listeners.filter((l) => l.name === name).length;
    }
}
