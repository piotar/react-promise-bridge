import { useEffect, useState } from 'react';
import { TriggerComponentDestroyedException } from '../exceptions/TriggerComponentDestroyedException';
import { ComposeAbortController } from '../utils/ComposeAbortController';

export function useDisposePromiseBridge(signals?: AbortSignal[]): AbortController {
    const [controller, setController] = useState<AbortController>(() => new ComposeAbortController(signals));
    useEffect(
        () => () =>
            setController((composeController) => {
                composeController.abort(new TriggerComponentDestroyedException());
                return new ComposeAbortController(signals);
            }),
        [],
    );
    return controller;
}
