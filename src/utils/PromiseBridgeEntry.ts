import { ReactElement } from 'react';
import { PromiseEntry, PromiseEntryOptions } from './PromiseEntry';

export interface PromiseBridgeEntryOptions extends PromiseEntryOptions {
    id?: string | number | symbol;
}

export class PromiseBridgeEntry<T = any> extends PromiseEntry<T> {
    public readonly id: string | number | symbol | undefined;

    constructor(public readonly component: ReactElement, { id, ...options }: PromiseBridgeEntryOptions = {}) {
        super(options);
        this.id = id;
    }
}
