import { PromiseState, useDeferredPromiseBridge } from '@piotar/react-promise-bridge';

interface ConfirmProps {
    header?: string;
    message: string;
}

export function Confirm({ header, message }: ConfirmProps): JSX.Element {
    const { state, resolve, reject, trigger } = useDeferredPromiseBridge<boolean>();

    return (
        <dialog className={state === PromiseState.Initial ? 'show' : 'hide'} onAnimationEnd={trigger}>
            {header ? <header>{header}</header> : null}
            <p>{message}</p>
            <footer>
                <button type="button" onClick={() => reject(new Error('Canceled'))}>
                    Cancel
                </button>
                <button type="button" onClick={() => resolve(true)}>
                    Confirm
                </button>
            </footer>
        </dialog>
    );
}
