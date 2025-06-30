import { PromiseState, useDeferredPromiseBridge } from '@piotar/react-promise-bridge';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
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
        <Dialog open={state === PromiseState.Initial} TransitionProps={{ onExited: trigger }} onClose={handleClose}>
            <DialogTitle>{header ? <header>{header}</header> : null}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Disagree</Button>
                <Button onClick={handleConfirm} autoFocus>
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export function confirm(message: string, header?: string): Promise<void> {
    return open(<Confirm message={message} header={header} />);
}
