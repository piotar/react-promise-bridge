import { EntryStrategy } from './constants/EntryStrategy';
import { PromiseEntryOptions } from './utils/PromiseEntry';

export interface BaseCreateEntryOptions extends Partial<PromiseEntryOptions> {}

export interface NormalStrategyCreateEntryOptions extends BaseCreateEntryOptions {
    strategy: EntryStrategy.Normal;
}

export interface RecreateOrRejectStrategyCreateEntryOptions extends BaseCreateEntryOptions {
    strategy: EntryStrategy.RejectIfExists | EntryStrategy.Recreate;
    id: string;
}

export type CreateEntryOptions =
    | NormalStrategyCreateEntryOptions
    | RecreateOrRejectStrategyCreateEntryOptions
    | BaseCreateEntryOptions;
