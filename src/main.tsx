import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const rootElement = document.getElementById('root');
if (!rootElement) {
	throw new Error('Root element not found');
}

// If no Clerk key is provided, render without ClerkProvider for development
if (!clerkPublishableKey || clerkPublishableKey === 'pk_test_your_clerk_key_here') {
	console.warn('Clerk publishable key not found. Running without authentication.');
	createRoot(rootElement).render(
		<StrictMode>
			<App />
		</StrictMode>
	);
} else {
	createRoot(rootElement).render(
		<StrictMode>
			<ClerkProvider publishableKey={clerkPublishableKey}>
				<App />
			</ClerkProvider>
		</StrictMode>
	);
}
