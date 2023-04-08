import { useState } from 'react';
import { PromiseState, useDeferredPromiseBridge } from '@piotar/react-promise-bridge';

interface ColorPickerProps {
    value?: string;
}

const colors = ['red', 'tomato', 'green', 'yellow', 'pink'];

export function ColorPicker({ value }: ColorPickerProps): JSX.Element {
    const [color, setColor] = useState(value ?? colors[0]);
    const { state, resolve, reject, trigger } = useDeferredPromiseBridge<string>();

    return (
        <dialog open={state === PromiseState.Initial} onAnimationEnd={trigger}>
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
