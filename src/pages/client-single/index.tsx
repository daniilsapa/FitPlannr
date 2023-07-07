import React from 'react';
import { useParams } from 'react-router-dom';
import { EntityId } from '@reduxjs/toolkit';
import { Form, Input, Button, Col, Row, Spin, Alert, Tag, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
	addClient,
	selectClientById,
	updateClient,
} from '../../entities/client/lib/client-slice';
import { Client, NewClient, PersonalRecord } from '../../entities/client/model';

// ---

interface ClientForm {
	name: string;
	description: string;
	personalRecords: PersonalRecord[];
}

interface ClientAddEditFormProps {
	onSubmit: (values: ClientForm) => Promise<void>;
	isPending: boolean;
	error?: string;
	initialValues: NewClient;
	clearAfterSubmit?: boolean;
}

function ClientAddEditForm({
	isPending,
	error,
	onSubmit,
	initialValues,
	clearAfterSubmit,
}: ClientAddEditFormProps) {
	const [form] = Form.useForm();

	const handleSubmit = async (values: ClientForm) => {
		await onSubmit(values);
		if (clearAfterSubmit) {
			form.resetFields();
		}
	};

	return (
		<Spin spinning={isPending} delay={200}>
			<Form
				form={form}
				onFinish={handleSubmit}
				validateTrigger="onSubmit"
				layout="vertical"
				initialValues={initialValues}
			>
				{error && <Alert type="error" message={error} banner />}

				<Form.Item
					label="Name"
					name="name"
					rules={[
						{
							required: true,
							message: 'Please enter a name for the client',
						},
						{ min: 3, message: 'Name must be at least 3 characters long' },
						{ max: 40, message: 'Name must be max 20 characters long' },
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Description"
					name="description"
					rules={[
						{
							max: 1000,
							message: 'Description must be max 100 characters long',
						},
					]}
				>
					<Input />
				</Form.Item>

				<Form.List name="categories">
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name }) => (
								<Space key={key} style={{ display: 'flex' }}>
									<Form.Item
										name={[name]}
										rules={[{ required: true, message: 'Missing first name' }]}
									>
										<Input placeholder="Category Name" />
									</Form.Item>
									<MinusCircleOutlined onClick={() => remove(name)} />
								</Space>
							))}
							<Form.Item>
								<Button
									type="dashed"
									onClick={() => add()}
									block
									icon={<PlusOutlined />}
								>
									Add field
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>

				<Form.Item
					label="Categories"
					name="categories"
					rules={[
						{
							max: 1000,
							message: 'Description must be max 100 characters long',
						},
					]}
				>
					<div contentEditable style={{ minHeight: '100px' }}>
						<Tag closable>qwerty</Tag>
					</div>
				</Form.Item>

				<Form.Item
					label="Link"
					name="link"
					rules={[
						{
							max: 2048,
							message: 'Description must be max 100 characters long',
						},
						{
							pattern:
								/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
							message: 'Please enter a valid URL',
						},
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item>
					<Button type="primary" htmlType="submit">
						Save
					</Button>
				</Form.Item>
			</Form>
		</Spin>
	);
}

ClientAddEditForm.defaultProps = {
	clearAfterSubmit: false,
	error: undefined,
};

export default function ClientSinglePage() {
	const { id } = useParams();
	const stored = useAppSelector((state) =>
		selectClientById(state, id as EntityId)
	) as Client;
	const dispatch = useAppDispatch();
	const [isPending, setIsPending] = React.useState(false);
	const [error, setError] = React.useState('false');
	const initialClient =
		id && stored ? stored : { name: '', description: '', personalRecords: [] };

	const handleSubmit = async (values: ClientForm) => {
		if (isPending) return;

		setIsPending(true);
		try {
			await (id
				? dispatch(
						updateClient({
							...stored,
							...values,
						})
				  )
				: dispatch(addClient(values))
			).unwrap();
		} catch (err) {
			const e = err as Error;
			setError(e.message);
		}

		setIsPending(false);
	};

	return (
		<Row>
			<Col span="8" offset="8">
				<ClientAddEditForm
					isPending={isPending}
					error={error}
					initialValues={initialClient}
					onSubmit={handleSubmit}
					clearAfterSubmit={!id}
				/>
			</Col>
		</Row>
	);
}
