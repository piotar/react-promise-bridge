import { ReactElement, useEffect } from 'react';
import Alert, { AlertProps } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { usePromiseBridge } from '@piotar/react-promise-bridge';
import { open } from './SystemPromiseBridge';

interface SystemAlertProps {
    content: string;
    header?: string;
    severity?: AlertProps['severity'];
}

export function SystemAlert({ header, content, severity }: SystemAlertProps): ReactElement {
    const { resolve } = usePromiseBridge<boolean>();

    useEffect(() => {
        const timeoutHandler = setTimeout(() => resolve(false), 3000);
        return () => clearTimeout(timeoutHandler);
    }, []);

    return (
        <Alert severity={severity} onClose={() => resolve(true)}>
            {header ? <AlertTitle>{header}</AlertTitle> : null}
            {content}
        </Alert>
    );
}

export function alert(content: string, header?: string, severity?: AlertProps['severity']): Promise<boolean> {
    return open(<SystemAlert content={content} header={header} severity={severity} />);
}
