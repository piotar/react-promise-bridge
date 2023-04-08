import { usePromiseBridge } from '@piotar/react-promise-bridge';

interface ConfirmProps {
    header?: string;
    message: string;
}

export function Confirm({ header, message }: ConfirmProps): JSX.Element {
    const { resolve, reject } = usePromiseBridge<boolean>();

    return (
        <dialog open={true}>
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
