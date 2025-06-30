import { PromiseState, useDeferredPromiseBridge } from '@piotar/react-promise-bridge';
import { open } from './SystemPromiseBridge';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ReactElement } from 'react';

interface ConfirmProps {
    header?: string;
    message: string;
}

export function Confirm({ header, message }: ConfirmProps): ReactElement {
    const { resolve, reject, state, trigger } = useDeferredPromiseBridge<void>();
    const handleClose = () => reject();
    const handleConfirm = () => resolve();

    return (
        <Modal show={state === PromiseState.Initial} onExited={trigger} onHide={handleClose}>
            {header ? (
                <Modal.Header>
                    <Modal.Title>{header}</Modal.Title>
                </Modal.Header>
            ) : null}
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose} variant="secondary">
                    Disagree
                </Button>
                <Button onClick={handleConfirm} autoFocus>
                    Agree
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export function confirm(message: string, header?: string): Promise<void> {
    return open(<Confirm message={message} header={header} />);
}
