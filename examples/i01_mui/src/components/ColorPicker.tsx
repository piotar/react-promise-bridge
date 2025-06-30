import { ReactElement, useState } from 'react';
import { PromiseState, useDeferredPromiseBridge } from '@piotar/react-promise-bridge';
import { open } from './SystemPromiseBridge';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

interface ColorPickerProps {
    value?: string;
}

const colors = ['red', 'tomato', 'green', 'yellow', 'pink'];

export function ColorPicker({ value }: ColorPickerProps): ReactElement {
    const [color, setColor] = useState(value ?? colors[0]);
    const { resolve, reject, state, trigger } = useDeferredPromiseBridge<string>();
    const handleClose = () => reject();

    return (
        <Dialog open={state === PromiseState.Initial} onClose={handleClose} TransitionProps={{ onExited: trigger }}>
            <DialogTitle>Choose color</DialogTitle>
            <DialogContent>
                <RadioGroup value={color} onChange={(event) => setColor(event.target.value)}>
                    {colors.map((option) => (
                        <FormControlLabel
                            value={option}
                            key={option}
                            control={<Radio />}
                            label={option}
                            style={{ color: option }}
                        />
                    ))}
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Cancel
                </Button>
                <Button onClick={() => resolve(color)}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
}

export function colorPicker(value?: string): Promise<string> {
    return open<string>(<ColorPicker value={value} />);
}
