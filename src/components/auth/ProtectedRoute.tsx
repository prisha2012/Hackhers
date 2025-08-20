import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	// Check if Clerk is available
	const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
	
	if (!clerkKey || clerkKey === 'pk_test_your_clerk_key_here') {
		// Development mode - allow access without authentication
		console.warn('Running in development mode without authentication');
		return <>{children}</>;
	}

	// Try to use Clerk hooks only if Clerk is properly configured
	try {
		const { useUser } = require('@clerk/clerk-react');
		const { isSignedIn, isLoaded } = useUser();

		if (!isLoaded) return null;
		if (!isSignedIn) return <Navigate to="/auth" replace />;
		return <>{children}</>;
	} catch (error) {
		// Fallback if Clerk hooks fail
		console.warn('Clerk hooks failed, allowing access for development');
		return <>{children}</>;
	}
};

export default ProtectedRoute;