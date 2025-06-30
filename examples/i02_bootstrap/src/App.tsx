import { CSSProperties, Fragment, ReactElement, useState } from 'react';
import { confirm } from './components/Confirm';
import { Container } from './components/SystemPromiseBridge';
import { colorPicker } from './components/ColorPicker';
import { alert } from './components/SystemAlert';
import Button from 'react-bootstrap/Button';

export function App(): ReactElement {
    const [style, setStyle] = useState<CSSProperties | undefined>();

    return (
        <Fragment>
            <article style={style}>
                <h3>Example of Promise Bridge</h3>
                <h6>Alerts:</h6>
                <nav>
                    <Button
                        type="button"
                        onClick={() => alert('This is a success alert', 'Success', 'success').then(console.log)}
                    >
                        Open success alert
                    </Button>
                    <Button
                        type="button"
                        onClick={() => alert('This is a warning alert', 'Warning', 'warning').then(console.log)}
                    >
                        Open warning alert
                    </Button>
                    <Button
                        type="button"
                        onClick={() => alert('This is a info alert', 'Info', 'info').then(console.log)}
                    >
                        Open info alert
                    </Button>
                    <Button
                        type="button"
                        onClick={() => alert('This is a error alert', 'Error', 'danger').then(console.log)}
                    >
                        Open error alert
                    </Button>
                </nav>

                <h6>Dialogs:</h6>
                <nav>
                    <Button
                        type="button"
                        onClick={() => colorPicker(style?.color).then((value) => setStyle({ color: value }))}
                    >
                        Open color picker
                    </Button>
                    <Button
                        type="button"
                        onClick={() =>
                            confirm('Lorem ipsum dolor sit...', 'Some example header')
                                .then(console.log)
                                .catch(console.warn)
                        }
                    >
                        Open confirm
                    </Button>
                </nav>
            </article>
            <Container />
        </Fragment>
    );
}
