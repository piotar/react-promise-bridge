import { CSSProperties, Fragment, useRef, useState } from 'react';
import { Confirm } from './components/Confirm';
import { Container, open } from './components/SystemPromiseBridge';
import { ColorPicker } from './components/ColorPicker';

let basicCounter = 0;
let confirmationCounter = 0;

export function App(): JSX.Element {
    const abortRef = useRef(new AbortController());
    const [style, setStyle] = useState<CSSProperties | undefined>();

    const handleColorPickerClick = async () => {
        try {
            const color = await open<string>(<ColorPicker value={style?.color} />, { signal: abortRef.current.signal });
            console.log('selected color', color);
            setStyle({ color });
        } catch (error) {
            console.warn(error instanceof Error ? error.message : error);
        }
    };

    const handleConfirmClick = async (message: string) => {
        const counter = confirmationCounter++;
        try {
            await open(<Confirm header={`Confirmation #${counter}`} message={message} />, {
                signal: abortRef.current.signal,
            });
            // handle confirm
            console.log('confirmed', counter);
        } catch (error) {
            console.warn(error instanceof Error ? error.message : error, counter);
        }
    };

    const handleAbortClick = () => {
        abortRef.current.abort(new Error('Custom event of abort'));
        abortRef.current = new AbortController();
    };

    return (
        <Fragment>
            <article style={style}>
                <h1>Example of Promise Bridge</h1>
                <p>Lorem ipsum dolor sit...</p>
                <nav>
                    <button
                        type="button"
                        onClick={() =>
                            open(<p>Mounted component without any actions #{basicCounter++}</p>, {
                                signal: abortRef.current.signal,
                            })
                        }
                    >
                        Open custom component without actions
                    </button>
                    <button type="button" onClick={() => handleConfirmClick('Confirm message')}>
                        Open confirm modal
                    </button>
                    <button type="button" onClick={handleColorPickerClick}>
                        Open color picker
                    </button>
                    <button type="button" onClick={handleAbortClick}>
                        Abort all
                    </button>
                </nav>
            </article>
            <Container />
        </Fragment>
    );
}
