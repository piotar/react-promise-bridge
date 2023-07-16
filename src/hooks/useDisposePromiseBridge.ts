import { useCallback, useEffect, useRef, useState } from 'react';
import { TriggerComponentDestroyedException } from '../exceptions/TriggerComponentDestroyedException';
import { ComposeAbortController } from '../utils/ComposeAbortController';

export function useDisposePromiseBridge(signals?: AbortSignal[]): AbortController {
    const createController = useCallback(() => new ComposeAbortController(signals), [signals]);
    const [controller, setController] = useState<AbortController>(createController);
    const controllerRef = useRef(controller);
    controllerRef.current = controller;
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
