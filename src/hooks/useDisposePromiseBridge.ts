import { useCallback, useEffect, useRef, useState } from 'react';
import { TriggerComponentDestroyedException } from '../exceptions/TriggerComponentDestroyedException';
import { ComposeAbortController } from '../utils/ComposeAbortController';

export function useDisposePromiseBridge(signals?: AbortSignal[]): AbortController {
    const createController = useCallback(() => new ComposeAbortController(signals), [signals]);
    const [controller, setController] = useState<AbortController>(createController);
    const controllerRef = useRef(controller);
    controllerRef.current = controller;
    // `createRef` always points at the latest `createController`. The dispose effect's cleanup
    // reads it at cleanup time (not from its captured closure) so a `signals` change recomposes
    // with a fresh controller built from the *new* signals, not the stale ones.
    const createRef = useRef(createController);
    createRef.current = createController;

    useEffect(() => {
        const handleAbort = () => setController(createRef.current());
        controller.signal.addEventListener('abort', handleAbort, { once: true });
        return () => controller.signal.removeEventListener('abort', handleAbort);
    }, [controller, createRef]);

    useEffect(
        () => () => {
            controllerRef.current.abort(new TriggerComponentDestroyedException());
            setController((controllerRef.current = createRef.current()));
        },
        [createRef.current],
    );

    return controllerRef.current;
}
