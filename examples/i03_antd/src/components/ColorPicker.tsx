import { ReactElement, useState } from 'react';
import { Modal, Select } from 'antd';
import { PromiseState, useDeferredPromiseBridge } from '@piotar/react-promise-bridge';
import { open } from './SystemPromiseBridge';

interface ColorPickerProps {
    value?: string;
}

const colors = ['red', 'tomato', 'green', 'yellow', 'pink'];

export function ColorPicker({ value }: ColorPickerProps): ReactElement {
    const [color, setColor] = useState(value ?? colors[0]);
    const { resolve, reject, state, trigger } = useDeferredPromiseBridge<string>();
    const handleClose = () => reject();
    const handleConfirm = () => resolve(color);

    return (
        <Modal
            open={state === PromiseState.Initial}
            onCancel={handleClose}
            onOk={handleConfirm}
            afterOpenChange={trigger}
            title="Choose color"
        >
            <Select onChange={(value) => setColor(value)} style={{ width: 200 }} defaultValue={color}>
                {colors.map((option) => (
                    <Select.Option value={option} key={option} style={{ color: option }}>
                        {option}
                    </Select.Option>
                ))}
            </Select>
        </Modal>
    );
}

export function colorPicker(value?: string): Promise<string> {
    return open(<ColorPicker value={value} />);
}
