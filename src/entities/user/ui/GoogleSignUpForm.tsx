import React, { useState } from 'react';
import { Form, Input, Button, Typography, Spin, Alert, Result } from 'antd';
import {
	BarcodeOutlined,
	GoogleOutlined,
	LeftOutlined,
} from '@ant-design/icons';

import { getGoogleAuthUrl } from '../../../shared/api';

import { validateInviteCode } from '../../../shared/api/invite-code-api';
import { I18nMessage } from '../../../shared/ui/i18n';
import { getUserProfile } from '../lib/userSlice';
import { useAppDispatch } from '../../../app/hooks';

// ---

const { Title } = Typography;

interface SignUpFormProps {
	switchToSignIn: () => void;
}

interface InviteCodeFormData {
	inviteCode: string;
}

interface ApiError {
	message: string;
	response?: {
		data?: {
			message: string;
		};
	};
}

export default function GoogleSignUpForm({ switchToSignIn }: SignUpFormProps) {
	const [isPending, setIsPending] = useState(false);
	const [step, setStep] = useState<number>(0);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);
	const [form] = Form.useForm();
	const dispatch = useAppDispatch();

	const handleGoogleSignUpSubmit = async () => {
		if (isPending) return;

		setError('');
		setIsPending(true);

		const windowFeatures = 'popup=true,width=640,height=800';
		const handle = window.open(
			getGoogleAuthUrl(form.getFieldValue('inviteCode')),
			'_blank',
			windowFeatures
		);

		if (handle) {
			try {
				await new Promise((resolve, reject) => {
					const interval = setInterval(function handleClosed() {
						if (handle.closed) {
							clearInterval(interval);
							reject();
						}
					}, 1000);
					window.addEventListener('message', (event) => {
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
				setIsPending(false);
			}
		}
	};

	const handleInviteCodeSubmit = async (formData: InviteCodeFormData) => {
		if (isPending) return;

		setError('');
		setIsPending(true);

		const { inviteCode } = formData;

		try {
			const { data } = await validateInviteCode(inviteCode);

			if (data.valid) {
				setStep(1);
			} else {
				setError('User.validation.inviteCode.invalid');
			}
		} catch (e) {
			// TODO: move error extraction to api layer and remove the workaround
			const err = e as ApiError;
			setError(err?.response?.data?.message || err.message);
		}

		setIsPending(false);
	};

	const handleBack = () => {
		setStep(0);
		setError('');
	};

	return success ? (
		<Result
			status="success"
			title={<I18nMessage id="User.signUp.successTitle" />}
			subTitle={<I18nMessage id="User.signUp.successSubtitle" />}
			extra={[
				<Button type="primary" onClick={switchToSignIn} key="switch">
					<I18nMessage id="User.signIn" />
				</Button>,
			]}
		/>
	) : (
		<Spin spinning={isPending} delay={200}>
			<div>
				<Title level={2}>
					<I18nMessage id="User.signUp" />
				</Title>

				{step === 0 ? (
					<Form
						onFinish={handleInviteCodeSubmit}
						validateTrigger="onSubmit"
						layout="vertical"
						form={form}
					>
						{error && (
							<Alert type="error" message={<I18nMessage id={error} />} banner />
						)}
						<Form.Item
							rules={[
								{
									required: true,
									message: (
										<I18nMessage id="User.validation.inviteCode.required" />
									),
								},
							]}
							label={<I18nMessage id="User.inviteCode" />}
							name="inviteCode"
						>
							<Input prefix={<BarcodeOutlined />} />
						</Form.Item>

						<Button type="primary" htmlType="submit" disabled={isPending}>
							<I18nMessage id="User.next" />
						</Button>
					</Form>
				) : (
					<Form
						onFinish={handleGoogleSignUpSubmit}
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
								<GoogleOutlined /> <I18nMessage id="User.signUp" />
							</Button>
							<Button
								type="default"
								block
								disabled={isPending}
								onClick={handleBack}
							>
								<LeftOutlined /> <I18nMessage id="User.back" />
							</Button>
						</Form.Item>
					</Form>
				)}

				<div style={{ margin: '2em 0 0' }}>
					<Typography.Text>
						<I18nMessage id="User.alreadyHaveAccount" />
					</Typography.Text>
					<Button type="link" onClick={switchToSignIn}>
						<I18nMessage id="User.signIn" />
					</Button>
				</div>
			</div>
		</Spin>
	);
}
