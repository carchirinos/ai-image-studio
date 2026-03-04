import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';

Amplify.configure({
  ...awsExports,
  Predictions: {
    identify: {
      identifyEntities: {
        proxy: false,
        region: 'us-west-2',
        celebrityDetectionEnabled: true,
        defaults: {
          collectionId: 'identifyEntities',
          maxEntities: 10
        }
      },
      identifyLabels: {
        proxy: false,
        region: 'us-west-2',
        type: 'ALL'
      }
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();