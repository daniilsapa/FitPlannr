import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

import { GoogleSignUpForm, GoogleSignInForm } from '../../entities/user';

import './index.css';

// ---

interface AuthPageProps {
	isAuthenticated: boolean;
}

export default function AuthPage({ isAuthenticated }: AuthPageProps) {
	const [isSignIn, setIsSignIn] = useState(true);

	if (isAuthenticated) {
		return <Navigate to="/workouts" />;
	}

	return (
		<div className="auth-page">
			<div
				style={{
					width: '100%',
				}}
			>
				<div>
					{isSignIn ? (
						<GoogleSignInForm switchToSignUp={() => setIsSignIn(false)} />
					) : (
						<GoogleSignUpForm switchToSignIn={() => setIsSignIn(true)} />
					)}
				</div>
			</div>
		</div>
	);
}
