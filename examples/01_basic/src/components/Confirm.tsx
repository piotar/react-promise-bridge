import { usePromiseBridge } from '@piotar/react-promise-bridge';

export function Confirm(props: { message: string }): JSX.Element {
    const { resolve, reject } = usePromiseBridge<boolean>();

    return <p>
        <span>{props.message}</span>
        <button type='button' onClick={() => reject(new Error('Confirm cancel'))}>cancel</button>
        <button type='button' onClick={() => resolve(true)}>confirm</button>
    </p>
}
