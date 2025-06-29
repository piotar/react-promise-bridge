import { Fragment, useEffect, useState, type ReactElement } from 'react';
import { PromiseContextProvider } from './PromiseContextProvider';
import { ContainerLimitReachedException } from '../exceptions/ContainerLimitReachedException';
import { PromiseBridgeEntry } from '../utils/PromiseBridgeEntry';
import { PromiseBridgeSubscription } from '../utils/PromiseBridgeSubscription';

export interface PromiseBridgeContainerProps {
    initialState: PromiseBridgeEntry[];
    subscription: PromiseBridgeSubscription;
    isMultiContainer: boolean;
}

export function PromiseBridgeContainer({
    subscription,
    initialState,
    isMultiContainer,
}: PromiseBridgeContainerProps): ReactElement {
    const [components, setComponents] = useState(initialState);

    useEffect(() => {
        if (subscription.count('sync') && !isMultiContainer) {
            throw new ContainerLimitReachedException();
        }
        const unsubscribe = subscription.subscribe('sync', setComponents);
        return () => {
            unsubscribe();
            subscription.dispatch('destroy');
        };
    }, [subscription]);

    return (
        <Fragment>
            {components.map(({ entryId, component, signal, resolve, reject }) => (
                <PromiseContextProvider key={entryId} signal={signal} resolve={resolve} reject={reject}>
                    {component}
                </PromiseContextProvider>
            ))}
        </Fragment>
    );
}
