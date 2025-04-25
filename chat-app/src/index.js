import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';  // Auto-generated AWS configuration file by Amplify

Amplify.configure(awsconfig); // Connect Amplify with your AWS resources

const root = createRoot(document.getElementById('root')); // Create root using createRoot method
root.render(<App />);
