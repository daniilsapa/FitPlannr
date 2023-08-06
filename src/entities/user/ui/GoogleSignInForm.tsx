import React, { useState } from 'react';
import { Form, Button, Typography, Spin, Alert, Result } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';

import { getGoogleAuthUrl } from '../../../shared/api';

import { I18nMessage } from '../../../shared/ui/i18n';
import { getUserProfile } from '../lib/userSlice';
import { useAppDispatch } from '../../../app/hooks';

// ---

const { Title } = Typography;

interface SignInFormProps {
	switchToSignUp: () => void;
}

export default function GoogleSignInForm({ switchToSignUp }: SignInFormProps) {
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);
	const dispatch = useAppDispatch();

	const handleGoogleSignInSubmit = async () => {
		if (isPending) return;

		setError('');
		setIsPending(true);

		const windowFeatures = 'popup=true,width=640,height=800';
		const handle = window.open(getGoogleAuthUrl(), '_blank', windowFeatures);

		if (handle) {
			try {
				await new Promise(function handlePopup(resolve, reject) {
					const interval = setInterval(function checkClosed() {
						if (handle.closed) {
							clearInterval(interval);
							reject();
						}
					}, 1000);
					window.addEventListener('message', (event) => {
						if (event.origin !== import.meta.env.VITE_API_ORIGIN) return;

						if (event.data === 'authentication:success') {
							resolve(true);
						} else {
							reject();
						}
						clearInterval(interval);
					});
				});

				await dispatch(getUserProfile()).unwrap();
				setSuccess(true);
			} catch (e) {
				setError('User.authenticationFailed');
			} finally {
				setIsPending(false);
			}
		}
	};

	return success ? (
		<Result
			status="success"
			title={<I18nMessage id="User.signUp.successTitle" />}
			subTitle={<I18nMessage id="User.signUp.successSubtitle" />}
		/>
	) : (
		<Spin spinning={isPending} delay={200}>
			<div>
				<Title level={2}>
					<I18nMessage id="User.signIn" />
				</Title>

				<Form
					onFinish={handleGoogleSignInSubmit}
					validateTrigger="onSubmit"
					layout="vertical"
				>
					{error && (
						<Alert type="error" message={<I18nMessage id={error} />} banner />
					)}
					<Form.Item>
						<Button
							type="primary"
							block
							htmlType="submit"
							style={{ marginBottom: 8 }}
							disabled={isPending}
						>
							<GoogleOutlined /> <I18nMessage id="User.signIn" />
						</Button>
					</Form.Item>
				</Form>

				<div style={{ margin: '2em 0 0' }}>
					<Typography.Text>
						<I18nMessage id="User.doNotHaveAccount" />
					</Typography.Text>
					<Button type="link" onClick={switchToSignUp}>
						<I18nMessage id="User.signUp" />
					</Button>
				</div>
			</div>
		</Spin>
	);
}
