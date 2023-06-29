import React from 'react';
import { Form, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { I18nMessage } from '../../../shared/ui/i18n';

// ---

export default function EmailField() {
	return (
		<Form.Item
			label={<I18nMessage id="User.email" />}
			name="email"
			rules={[
				{
					type: 'email',
					message: <I18nMessage id="User.validation.email.invalid" />,
				},
				{
					required: true,
					message: <I18nMessage id="User.validation.email.required" />,
				},
			]}
		>
			<Input
				prefix={<UserOutlined className="site-form-item-icon" />}
				placeholder="user@example.com"
			/>
		</Form.Item>
	);
}
