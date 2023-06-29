import React from 'react';
import { InfoCircleOutlined, LockOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';

import { I18nMessage } from '../../../shared/ui/i18n';

// ---

function PasswordFormatConstraintsList() {
	return (
		<ul>
			<li>
				<I18nMessage id="User.validation.password.length" />
			</li>
			<li>
				<I18nMessage id="User.validation.password.atLeastOneUpperLetter" />
			</li>
			<li>
				<I18nMessage id="User.validation.password.atLeastOneLowerLetter" />
			</li>
			<li>
				<I18nMessage id="User.validation.password.atLeastOneDigit" />
			</li>
			<li>
				<I18nMessage id="User.validation.password.atLeastOneSpecialCharacter" />
			</li>
		</ul>
	);
}

export default function PasswordField() {
	return (
		<Form.Item
			name="password"
			label={<I18nMessage id="User.password" />}
			tooltip={{
				title: <PasswordFormatConstraintsList />,
				icon: <InfoCircleOutlined />,
			}}
			rules={[
				{
					required: true,
					message: <I18nMessage id="User.validation.password.required" />,
				},
				{
					min: 8,
					message: <I18nMessage id="User.validation.password.minLength" />,
				},
				{
					max: 32,
					message: <I18nMessage id="User.validation.password.maxLength" />,
				},
				{
					pattern:
						/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/,
					message: (
						<div>
							<I18nMessage id="User.passwordConstraints" />:
							<PasswordFormatConstraintsList />
						</div>
					),
				},
			]}
		>
			<Input.Password
				prefix={<LockOutlined className="site-form-item-icon" />}
			/>
		</Form.Item>
	);
}
