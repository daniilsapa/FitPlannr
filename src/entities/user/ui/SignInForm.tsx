import React, { useState } from 'react';
import { Alert, Button, Form, Spin, Typography } from 'antd';
import { I18nMessage } from '../../../shared/ui/i18n';

import EmailField from './EmailField';
import PasswordField from './PasswordField';
import { signInUser, getUserProfile } from '../lib/userSlice';
import { useAppDispatch } from '../../../app/hooks';

// ---

const { Title } = Typography;

interface SignInFormProps {
	switchToSignUp: () => void;
}

interface SignInFormData {
	email: string;
	password: string;
}

interface ApiError {
	message: string;
	response?: {
		data?: {
			message: string;
		};
	};
}

export default function SignInForm({ switchToSignUp }: SignInFormProps) {
	const dispatch = useAppDispatch();
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState('');

	const handleFormSubmit = async (formData: SignInFormData) => {
		if (isPending) return;

		setError('');
		setIsPending(true);

		try {
			await dispatch(signInUser(formData)).unwrap();
		} catch (e) {
			// TODO: move error extraction to api layer and remove the workaround
			const err = e as ApiError;
			setError(err?.response?.data?.message || err.message);
			setIsPending(false);
			return;
		}

		try {
			await dispatch(getUserProfile()).unwrap();
		} catch (e) {
			// TODO: move error extraction to api layer and remove the workaround
			const err = e as ApiError;
			setError(err?.response?.data?.message || err.message);
		}

		setIsPending(false);
	};

	return (
		<Spin spinning={isPending} delay={200}>
			<div>
				<Title level={2}>
					<I18nMessage id="User.signIn" />
				</Title>

				<Form
					onFinish={handleFormSubmit}
					validateTrigger="onSubmit"
					layout="vertical"
				>
					{error && <Alert type="error" message={error} banner />}

					<EmailField />

					<PasswordField />

					<Form.Item>
						<Button type="primary" htmlType="submit" disabled={isPending}>
							<I18nMessage id="User.submit" />
						</Button>
					</Form.Item>
				</Form>
				<div>
					<I18nMessage id="User.doNotHaveAccount" />
					<Button type="link" onClick={switchToSignUp}>
						<I18nMessage id="User.signUp" />
					</Button>
				</div>
			</div>
		</Spin>
	);
}
