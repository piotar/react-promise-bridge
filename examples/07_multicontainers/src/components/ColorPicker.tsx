import { useState } from 'react';
import { usePromiseBridge } from '@piotar/react-promise-bridge';

interface ColorPickerProps {
    value?: string;
}

const colors = ['red', 'tomato', 'green', 'yellow', 'pink'];

export function ColorPicker({ value }: ColorPickerProps): JSX.Element {
    const [color, setColor] = useState(value ?? colors[0]);
    const { resolve, reject } = usePromiseBridge<string>();

    return (
        <dialog>
            <section>
                <label>Choose color</label>
                <select onChange={(e) => setColor(e.target.value)} defaultValue={color}>
                    {colors.map((color) => (
                        <option key={color} value={color}>
                            {color}
                        </option>
                    ))}
                </select>
            </section>

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
