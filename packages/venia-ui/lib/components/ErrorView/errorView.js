import React, { useMemo } from 'react';

import { fullPageLoadingIndicator } from '../LoadingIndicator';

const messages = new Map()
    .set('loading', fullPageLoadingIndicator)
    .set('notFound', 'That page could not be found. Please try again.')
    .set('internalError', 'Something went wrong. Please try again.');

const ErrorView = props => {
    const { loading, notFound } = props;

    const message = useMemo(() => {
        return loading
            ? messages.get('loading')
            : notFound
            ? messages.get('notFound')
            : messages.get('internalError');
    }, [loading, notFound]);

    return <h1>{message}</h1>;
};

export default ErrorView;
