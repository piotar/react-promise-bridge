import { EntryStategy } from './constants/EntryStategy';
import { PromiseEntryOptions } from './utils/PromiseEntry';

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
