import { PromiseState, useDeferredPromiseBridge } from '@piotar/react-promise-bridge';
import { Modal } from 'antd';
import { open } from './SystemPromiseBridge';
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
        <Modal
            open={state === PromiseState.Initial}
            afterOpenChange={trigger}
            onCancel={handleClose}
            onOk={handleConfirm}
            title={header}
        >
            {message}
        </Modal>
    );
}

export function confirm(message: string, header?: string): Promise<void> {
    return open(<Confirm message={message} header={header} />);
}
