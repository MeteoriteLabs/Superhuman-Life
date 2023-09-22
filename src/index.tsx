import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as Sentry from '@sentry/react';

Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [
        new Sentry.BrowserTracing({
            tracePropagationTargets: [process.env.REACT_APP_DEPLOYED_URL as string]
        }),
        new Sentry.Replay()
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0
});

ReactDOM.render(<App />, document.getElementById('root'));

reportWebVitals();
