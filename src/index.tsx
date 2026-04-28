import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from '@/components/ui/provider';
import Fonts from './components/Fonts';
import { Toaster } from './components/ui/toaster';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('No se pudo encontrar el elemento root');
}

createRoot(rootElement).render(
    <React.StrictMode>
        <Provider>
            <Fonts />
            <Toaster />
            <App />
        </Provider>
    </React.StrictMode>
);