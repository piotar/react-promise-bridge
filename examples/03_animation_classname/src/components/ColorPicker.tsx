import { useState } from 'react';
import { PromiseState, useDeferredPromiseBridge } from '@piotar/react-promise-bridge';

interface ColorPIckerProps {
    value?: string;
}

const colors = ['red', 'tomato', 'green', 'yellow', 'pink'];

export function ColorPicker({ value }: ColorPIckerProps): JSX.Element {
    const [color, setColor] = useState(value ?? colors[0]);
    const { state, resolve, reject, trigger } = useDeferredPromiseBridge<string>();

    return (
        <dialog className={state === PromiseState.Initial ? 'show' : 'hide'} onAnimationEnd={trigger}>
            <header>Choose color</header>
            <p>
                <select onChange={(e) => setColor(e.target.value)} defaultValue={color}>
                    {colors.map((color) => (
                        <option key={color} value={color}>
                            {color}
                        </option>
                    ))}
                </select>
            </p>
            <footer>
                <button type="button" onClick={() => reject(new Error('Canceled'))}>
                    Cancel
                </button>
                <button type="button" onClick={() => resolve(color)}>
                    Confirm
                </button>
            </footer>
        </dialog>
    );
}
