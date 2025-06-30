import { CSSProperties, Fragment, ReactElement, useState } from 'react';
import { Container, open } from './components/SystemPromiseBridge';
import { ColorPicker } from './components/ColorPicker';

export function App(): ReactElement {
    const [style, setStyle] = useState<CSSProperties | undefined>();

    const handleColorPickerClick = async () => {
        try {
            const color = await open<string>(<ColorPicker value={style?.color} />);
            console.log('selected color', color);
            setStyle({ color });
        } catch (error) {
            console.warn(error instanceof Error ? error.message : error);
        }
    };

    return (
        <Fragment>
            <Container />
            <article style={style}>
                <h1>Example of Promise Bridge</h1>
                <p>Lorem ipsum dolor sit...</p>
                <nav>
                    <button type="button" onClick={handleColorPickerClick}>
                        Open color picker as message
                    </button>
                </nav>
            </article>
            <Container />
        </Fragment>
    );
}
