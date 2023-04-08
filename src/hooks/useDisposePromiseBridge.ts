import { useEffect, useState } from 'react';
import { TriggerComponentDestroyedException } from '../exceptions/TriggerComponentDestroyedException';

export function useDisposePromiseBridge(controller?: AbortController): AbortController {
    const [instance] = useState<AbortController>(() => controller ?? new AbortController());
    useEffect(() => () => void instance.abort(new TriggerComponentDestroyedException()), []);
    return instance;
}
