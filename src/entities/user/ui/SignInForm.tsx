import React from 'react';
import { Button, Form, Typography } from 'antd';
import { I18nMessage } from '../../../shared/ui/i18n';

import EmailField from './EmailField';
import PasswordField from './PasswordField';

// ---

const { Title } = Typography;

interface SignInFormProps {
	switchToSignUp: () => void;
}

export default function SignInForm({ switchToSignUp }: SignInFormProps) {
	const handleFormSubmit = () => {};

	return (
		<div>
			<Title level={2}>
				<I18nMessage id="User.signIn" />
			</Title>

			<Form
				onFinish={handleFormSubmit}
				validateTrigger="onSubmit"
				layout="vertical"
			>
				<EmailField />

				<PasswordField />

				<Form.Item>
					<Button type="primary" htmlType="submit">
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
	);
}
