import { PromiseEntryOptions } from './utils/PromiseEntry';

export enum EntryStategy {
    Normal,
    Recreate,
    RejectIfExists,
}

export interface BaseCreateEntryOptions extends Partial<PromiseEntryOptions> {}

export interface NormalStrategyCreateEntryOptions extends BaseCreateEntryOptions {
    strategy: EntryStategy.Normal;
}

export interface RecreateOrRejectStrategyCreateEntryOptions extends BaseCreateEntryOptions {
    strategy: EntryStategy.RejectIfExists | EntryStategy.Recreate;
    id: string;
}

export type CreateEntryOptions =
    | NormalStrategyCreateEntryOptions
    | RecreateOrRejectStrategyCreateEntryOptions
    | BaseCreateEntryOptions;
