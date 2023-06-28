import React, { useEffect } from 'react';
import { Button, Form, Input, Typography } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { I18nMessage } from '../../../shared/ui/i18n';

// ---

const { Title } = Typography;

export default function SignUpForm() {
	const { control, setFocus } = useForm();

	const handleFormSubmit = () => {};

	useEffect(() => {
		setFocus('username');
	}, [setFocus]);

	return (
		<div>
			<Title level={2}>
				<I18nMessage id="User.signIn" />
			</Title>

			<Form onFinish={handleFormSubmit} layout="vertical">
				<Form.Item label={<I18nMessage id="User.email" />}>
					<Controller
						name="email"
						control={control}
						rules={{ required: true }}
						render={({ field: { onChange, onBlur, value, ref } }) => (
							<Input
								value={value}
								onChange={onChange}
								onBlur={onBlur}
								ref={ref}
							/>
						)}
					/>
				</Form.Item>

				<Form.Item label={<I18nMessage id="User.password" />}>
					<Controller
						name="password"
						control={control}
						rules={{ required: true }}
						render={({ field: { onChange, onBlur, value, ref } }) => (
							<Input.Password
								value={value}
								onChange={onChange}
								onBlur={onBlur}
								ref={ref}
							/>
						)}
					/>
				</Form.Item>

				<Form.Item>
					<Button type="primary" htmlType="submit">
						<I18nMessage id="User.submit" />
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}
