import { describe, expect, it } from 'vitest';
import { PromiseBridgeSubscription } from './PromiseBridgeSubscription';
import { Subscription } from './Subscription';

describe('PromiseBridgeSubscription', () => {
    it('should return correct interface', () => {
        const instance = new PromiseBridgeSubscription();

        expect(instance).toBeInstanceOf(Subscription);
    });
});
