import { useEffect } from 'react';
import { useToasts, getToastId } from '@magento/peregrine';

/**
 *
 * @param {props} props
 */
const ErrorView = props => {
    const [, { addToast, removeToast }] = useToasts();
    const toastProps = props.toastProps;

    useEffect(() => {
        console.log('changed');
        const toastId = getToastId(toastProps);
        addToast(toastProps);
        return () => {
            removeToast(toastId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
};

export default ErrorView;
