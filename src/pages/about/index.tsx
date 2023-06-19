import React from 'react';

import { FormattedDisplayName } from 'react-intl';
import { Button, Divider, Space, Form, Checkbox, Input } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { selectCount } from '../../entities/counter';

import { useAppSelector } from '../../app/hooks';

// ---

interface AboutPageProps {
	onChangeLocale: () => void;
	locale: string;
}

function DummyForm() {
	const { handleSubmit, control } = useForm();

	const onSubmit = () => {};

	return (
		<Form onFinish={handleSubmit(onSubmit)}>
			<Form.Item label="Username">
				<Controller
					name="username"
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

			<Form.Item label="Password">
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

			<Form.Item label="Company">
				<Controller
					name="company"
					control={control}
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

			<Form.Item>
				<Controller
					name="readPrivacyPolicy"
					control={control}
					rules={{ required: true }}
					render={({ field: { onChange, value, ref } }) => (
						<Checkbox value={value} onChange={onChange} ref={ref}>
							I have read the privacy policy
						</Checkbox>
					)}
				/>
			</Form.Item>

			<Form.Item>
				<Button type="primary" htmlType="submit">
					Submit
				</Button>
			</Form.Item>
		</Form>
	);
}

function AboutPage({ onChangeLocale, locale }: AboutPageProps) {
	const count = useAppSelector(selectCount);

	return (
		<Space>
			<DummyForm />
			<Divider />
			<Button type="primary" onClick={onChangeLocale}>
				<FormattedDisplayName type="language" value={locale} />
			</Button>
			<Divider />
			<span>Current counter value: {count}</span>
		</Space>
	);
}

export default AboutPage;
