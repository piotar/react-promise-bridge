import { ComponentType, createElement, memo, ReactElement } from 'react';
import { PromiseBridgeContainer, PromiseBridgeContainerProps } from '../components/PromiseBridgeContainer';
import { EntryStategy } from '../constants/EntryStategy';
import { ContainerDestroyedException } from '../exceptions/ContainerDestroyedException';
import { ContainerNotMountedException } from '../exceptions/ContainerNotMountedException';
import { EntryExistsException } from '../exceptions/EntryExistsException';
import { EntryRecreateException } from '../exceptions/EntryRecreateException';
import { MissingEntryIdException } from '../exceptions/MissingEntryIdException';
import {
    CreateEntryOptions,
    NormalStrategyCreateEntryOptions,
    RecreateOrRejectStrategyCreateEntryOptions,
} from '../promiseBridge.types';
import { PromiseBridgeEntry } from './PromiseBridgeEntry';
import { PromiseBridgeSubscription } from './PromiseBridgeSubscription';

export interface PromiseBridgeOptions {
    isMultiContainer: boolean;
    container: ComponentType<PromiseBridgeContainerProps>;
}

export class PromiseBridge {
    private entries: PromiseBridgeEntry[] = [];
    private subscription = new PromiseBridgeSubscription();
    private readonly options: PromiseBridgeOptions;

    private constructor(options?: Partial<PromiseBridgeOptions>) {
        this.options = {
            isMultiContainer: false,
            container: PromiseBridgeContainer,
            ...options,
        };
        this.subscription.subscribe('destroy', this.destroyContainer.bind(this));
    }

    private destroyContainer(): void {
        if (!this.subscription.count('sync')) {
            this.entries.forEach((entry) => entry.reject(new ContainerDestroyedException()));
            this.entries = [];
        }
    }

    private sync(entires: PromiseBridgeEntry[]): void {
        this.entries = entires;
        this.subscription.dispatch('sync', this.entries);
    }

    private entryStrategyGuard(
        options: RecreateOrRejectStrategyCreateEntryOptions | NormalStrategyCreateEntryOptions,
    ): void {
        switch (options.strategy) {
            case EntryStategy.Recreate:
                if (!options.id) {
                    throw new MissingEntryIdException();
                }
                return void this.entries.find(({ id }) => id === options.id)?.reject(new EntryRecreateException());
            case EntryStategy.RejectIfExists:
                if (!options.id) {
                    throw new MissingEntryIdException();
                }
                if (this.entries.some(({ id }) => id === options.id)) {
                    throw new EntryExistsException();
                }
                return void 0;
            case EntryStategy.Normal:
            default:
                return void 0;
        }
    }

    private entryGuard(options: CreateEntryOptions): void {
        if (!this.subscription.count('sync')) {
            throw new ContainerNotMountedException();
        }
        if ('strategy' in options) {
            this.entryStrategyGuard(options);
        }
    }

    private async createEntry<T>(component: ReactElement, options?: CreateEntryOptions): Promise<T> {
        const entryOptions: CreateEntryOptions = {
            strategy: EntryStategy.Normal,
            ...options,
        };
        this.entryGuard(entryOptions);
        const entry = new PromiseBridgeEntry<T>(component, entryOptions);
        this.sync([...this.entries, entry]);
        return entry.promise.finally(() => {
            if (this.entries.length) {
                this.sync(this.entries.filter((e) => e !== entry));
            }
        });
    }

    private createContainer(): ComponentType {
        return memo(() =>
            createElement(this.options.container, {
                subscription: this.subscription,
                initialState: this.entries,
                isMultiContainer: this.options.isMultiContainer,
            }),
        );
    }

    public static create(
        options?: Partial<PromiseBridgeOptions>,
    ): [ComponentType, <T>(component: ReactElement, options?: CreateEntryOptions) => Promise<T>] {
        const instance = new PromiseBridge(options);
        return [instance.createContainer(), instance.createEntry.bind(instance)];
    }
}
