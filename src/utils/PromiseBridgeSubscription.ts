import { PromiseBridgeEntry } from './PromiseBridgeEntry';
import { Subscription, SubscriptionActions } from './Subscription';

export interface PromiseBridgeSubscriptionActions extends SubscriptionActions {
    sync: PromiseBridgeEntry[];
    destroy: void;
}

export class PromiseBridgeSubscription extends Subscription<PromiseBridgeSubscriptionActions> {}
