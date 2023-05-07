import { PromiseState, useDeferredPromiseBridge, useFactoryPromiseBridge } from '@piotar/react-promise-bridge';
import { Button, Drawer, Space } from 'antd';

function SecondDrawer(): JSX.Element {
    const { state, resolve, trigger } = useDeferredPromiseBridge();

    const handleClose = () => resolve(false);
    const handleConfirm = () => resolve(true);

    return (
        <Drawer
            title="Second Drawer"
            onClose={handleClose}
            afterOpenChange={trigger}
            open={state === PromiseState.Initial}
            extra={
                <Space>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="primary" onClick={handleConfirm}>
                        OK
                    </Button>
                </Space>
            }
        >
            This is second-level drawer
        </Drawer>
    );
}

export function TopDrawer(): JSX.Element {
    const { state, resolve, trigger } = useDeferredPromiseBridge();
    const [Container, open] = useFactoryPromiseBridge();

    const handleClose = () => resolve(false);
    const handleConfirm = () => resolve(true);

    return (
        <Drawer
            title="Top Drawer"
            width={500}
            onClose={handleClose}
            afterOpenChange={trigger}
            open={state === PromiseState.Initial}
            extra={
                <Space>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="primary" onClick={handleConfirm}>
                        OK
                    </Button>
                </Space>
            }
        >
            <Button type="primary" onClick={() => open(<SecondDrawer />).then(console.log)}>
                Open nested Drawer
            </Button>
            <Container />
        </Drawer>
    );
}
