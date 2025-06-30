import { ReactElement, useEffect } from 'react';
import { usePromiseBridge } from '@piotar/react-promise-bridge';
import Alert, { AlertProps } from 'react-bootstrap/Alert';
import { open } from './SystemPromiseBridge';

interface SystemAlertProps extends Pick<AlertProps, 'variant'> {
    content: string;
    header?: string;
}

export function SystemAlert({ header, content, variant }: SystemAlertProps): ReactElement {
    const { resolve } = usePromiseBridge<boolean>();

    useEffect(() => {
        const timeoutHandler = setTimeout(() => resolve(false), 3000);
        return () => clearTimeout(timeoutHandler);
    }, []);

    return (
        <Alert variant={variant} onClose={() => resolve(true)} dismissible>
            {header ? <Alert.Heading>{header}</Alert.Heading> : null}
            {content}
        </Alert>
    );
}

export function alert(content: string, header?: string, variant?: SystemAlertProps['variant']): Promise<boolean> {
    return open(<SystemAlert content={content} header={header} variant={variant} />);
}
