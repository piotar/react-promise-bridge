import { useState } from 'react';
import { PromiseState, useDeferredPromiseBridge } from '@piotar/react-promise-bridge';
import { open } from './SystemPromiseBridge';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

interface ColorPickerProps {
    value?: string;
}

const colors = ['red', 'tomato', 'green', 'yellow', 'pink'];

export function ColorPicker({ value }: ColorPickerProps): JSX.Element {
    const [color, setColor] = useState(value ?? colors[0]);
    const { resolve, reject, state, trigger } = useDeferredPromiseBridge<string>();
    const handleClose = () => reject();

    return (
        <Modal show={state === PromiseState.Initial} onHide={handleClose} onExited={trigger}>
            <Modal.Header>
                <Modal.Title>Choose color</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {colors.map((option) => (
                        <Form.Check
                            type="radio"
                            checked={color === option}
                            value={option}
                            id={option}
                            key={option}
                            label={option}
                            style={{ color: option }}
                            onChange={(event) => setColor(event.target.value)}
                        />
                    ))}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button autoFocus onClick={handleClose} variant="secondary">
                    Cancel
                </Button>
                <Button onClick={() => resolve(color)}>Ok</Button>
            </Modal.Footer>
        </Modal>
    );
}

export function colorPicker(value?: string): Promise<string> {
    return open<string>(<ColorPicker value={value} />);
}
