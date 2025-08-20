import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
	throw new Error('Root element not found');
}

// Always render without ClerkProvider for now - using mock authentication
console.warn('Using mock authentication system.');
createRoot(rootElement).render(
	<StrictMode>
		<App />
	</StrictMode>
);
