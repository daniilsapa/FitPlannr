import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

import { SignInForm, SignUpForm } from '../../entities/user';

import './index.css';

// ---

interface AuthPageProps {
	isAuthenticated: boolean;
}

export default function AuthPage({ isAuthenticated }: AuthPageProps) {
	const [isSignIn, setIsSignIn] = useState(true);

	if (isAuthenticated) {
		return <Navigate to="/" />;
	}

	return (
		<div className="auth-page">
			<main className="auth-page-inner">
				<div>
					<div>
						{isSignIn ? (
							<SignInForm switchToSignUp={() => setIsSignIn(false)} />
						) : (
							<SignUpForm switchToSignIn={() => setIsSignIn(true)} />
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
