import React from 'react';
import { Navigate } from 'react-router-dom';

// ---

interface ProtectedRouteProps {
	navigateTo: string;
	isAuthenticated: boolean;
	children: React.ReactNode;
}

export default function ProtectedRoute({
	navigateTo,
	isAuthenticated,
	children,
}: ProtectedRouteProps) {
	if (!isAuthenticated) {
		return <Navigate to={navigateTo} />;
	}

	// eslint-disable-next-line react/jsx-no-useless-fragment
	return <>{children}</>;
}
