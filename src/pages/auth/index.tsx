import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from 'antd';

import { SignInForm, SignUpForm } from '../../entities/user';

import './index.css';
import { I18nMessage } from '../../shared/ui/i18n';

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
							<>
								<SignInForm />
								<div>
									<I18nMessage id="User.doNotHaveAccount" />
									<Button type="link" onClick={() => setIsSignIn(!isSignIn)}>
										<I18nMessage id="User.signUp" />
									</Button>
								</div>
							</>
						) : (
							<>
								<SignUpForm />
								<div>
									<I18nMessage id="User.alreadyHaveAccount" />
									<Button type="link" onClick={() => setIsSignIn(!isSignIn)}>
										<I18nMessage id="User.signIn" />
									</Button>
								</div>
							</>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
