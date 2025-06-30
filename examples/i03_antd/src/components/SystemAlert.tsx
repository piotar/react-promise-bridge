import { ReactElement, useEffect } from 'react';
import { usePromiseBridge } from '@piotar/react-promise-bridge';
import { Alert, AlertProps } from 'antd';
import { open } from './SystemPromiseBridge';

interface SystemAlertProps extends Pick<AlertProps, 'type'> {
    content: string;
    header?: string;
}

export function SystemAlert({ header, content, type }: SystemAlertProps): ReactElement {
    const { resolve } = usePromiseBridge<boolean>();

    useEffect(() => {
        const timeoutHandler = setTimeout(() => resolve(false), 3000);
        return () => clearTimeout(timeoutHandler);
    }, []);

    return <Alert type={type} message={header} description={content} onClose={() => resolve(true)} closable showIcon />;
}

export function alert(content: string, header?: string, type?: SystemAlertProps['type']): Promise<boolean> {
    return open(<SystemAlert content={content} header={header} type={type} />);
}
