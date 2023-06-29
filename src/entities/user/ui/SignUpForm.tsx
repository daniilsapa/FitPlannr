import React, { useState } from 'react';
import { Form, Input, Button, Typography, Spin, Alert, Result } from 'antd';
import { BarcodeOutlined } from '@ant-design/icons';

import EmailField from './EmailField';
import PasswordField from './PasswordField';
import { signUp } from '../api';
import { I18nMessage } from '../../../shared/ui/i18n';

// ---

const { Title } = Typography;

interface SignUpFormProps {
	switchToSignIn: () => void;
}

interface SignUpFormData {
	email: string;
	password: string;
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

export default function SignUpForm({ switchToSignIn }: SignUpFormProps) {
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	const handleFormSubmit = async (formData: SignUpFormData) => {
		if (isPending) return;

		setError('');
		setIsPending(true);

		const { email, password, inviteCode } = formData;

		try {
			await signUp(email, password, inviteCode);
			setSuccess(true);
		} catch (e) {
			// TODO: move error extraction to api layer and remove the workaround
			const err = e as ApiError;
			setError(err?.response?.data?.message || err.message);
		}
		setIsPending(false);
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
		<Spin spinning={isPending} delay={500}>
			<div>
				<Title level={2}>
					<I18nMessage id="User.signUp" />
				</Title>

				<Form
					onFinish={handleFormSubmit}
					validateTrigger="onSubmit"
					layout="vertical"
				>
					{error && <Alert type="error" message={error} banner />}

					<EmailField />

					<PasswordField />

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

					<Form.Item>
						<Button type="primary" htmlType="submit" disabled={isPending}>
							<I18nMessage id="User.submit" />
						</Button>
					</Form.Item>
				</Form>
				<div>
					<I18nMessage id="User.alreadyHaveAccount" />
					<Button type="link" onClick={switchToSignIn}>
						<I18nMessage id="User.signIn" />
					</Button>
				</div>
			</div>
		</Spin>
	);
}
