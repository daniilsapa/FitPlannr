import React from 'react';
import { useParams } from 'react-router-dom';
import { EntityId } from '@reduxjs/toolkit';
import {
	Form,
	Input,
	Button,
	Col,
	Row,
	Spin,
	Alert,
	Space,
	Select,
	InputNumber,
	Typography,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
	addClient,
	updateClient,
	selectClientById,
	selectIsLoading as selectClientsAreLoading,
} from '../../entities/client/lib/client-slice';
import { Client, NewClient, PersonalRecord } from '../../entities/client/model';
import {
	selectAllExercises,
	selectIsLoading as selectExercisesAreLoading,
} from '../../entities/exercise/lib/exercise-slice';
import { I18nMessage } from '../../shared/ui/i18n';

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
	const exercises = useAppSelector(selectAllExercises);
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
					label={<I18nMessage id="Client.name" />}
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
					<Input showCount maxLength={40} />
				</Form.Item>

				<Form.Item
					label={<I18nMessage id="Client.description" />}
					name="description"
					rules={[
						{
							max: 1000,
							message: 'Description must be max 100 characters long',
						},
					]}
				>
					<Input.TextArea showCount maxLength={1000} />
				</Form.Item>

				<Form.List name="personalRecords">
					{(fields, { add, remove }) => (
						<>
							<div className="ant-col ant-form-item-label css-dev-only-do-not-override-8fxyvw">
								<Typography.Text>
									<I18nMessage id="Client.personalRecords" />
								</Typography.Text>
							</div>
							{fields.map(({ key, name }) => (
								<Space
									key={key}
									style={{ display: 'flex', alignItems: 'baseline' }}
								>
									<Form.Item
										style={{ marginBottom: '8px' }}
										name={[name, 'exercise']}
										rules={[
											{
												required: true,
												message: 'Please enter a name for the client',
											},
										]}
									>
										<Select size="small" showSearch style={{ width: 200 }}>
											{exercises
												.filter(
													({ _id }) =>
														!(form.getFieldsValue().personalRecords || []).find(
															(record: PersonalRecord) =>
																record ? record.exercise === _id : false
														)
												)
												.map((exercise) => (
													<Select.Option
														key={exercise._id}
														value={exercise._id}
													>
														{exercise.name}
													</Select.Option>
												))}
										</Select>
									</Form.Item>
									<Form.Item
										name={[name, 'record']}
										style={{ marginBottom: '8px' }}
										rules={[
											{
												required: true,
												message: 'Please enter a name for the client',
											},
											{
												pattern: /^[0-9]+$/,
												message: 'Please enter a number',
											},
										]}
									>
										<InputNumber size="small" />
									</Form.Item>
									<Button
										size="small"
										type="text"
										style={{ marginTop: '4px' }}
										onClick={() => remove(name)}
										icon={<MinusCircleOutlined />}
									/>
								</Space>
							))}
							<Form.Item>
								<Button
									type="dashed"
									onClick={() => add()}
									block
									icon={<PlusOutlined />}
								>
									<I18nMessage id="Client.addRecord" />
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>

				<Form.Item>
					<Button type="primary" htmlType="submit">
						<I18nMessage id="Common.save" />
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
	const loading = useAppSelector(
		(state) =>
			selectClientsAreLoading(state) || selectExercisesAreLoading(state)
	);
	const { id } = useParams();
	const stored = useAppSelector((state) =>
		selectClientById(state, id as EntityId)
	) as Client;
	const dispatch = useAppDispatch();
	const [isPending, setIsPending] = React.useState(false);
	const [error, setError] = React.useState('');
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

	let render = null;

	if (loading) {
		render = (
			<Spin tip="Loading" size="small">
				<div className="content" />
			</Spin>
		);
	} else if (id && !stored) {
		render = <Alert type="error" message="Client not found" banner />;
	} else {
		render = (
			<ClientAddEditForm
				isPending={isPending}
				error={error}
				initialValues={initialClient}
				onSubmit={handleSubmit}
				clearAfterSubmit={!id}
			/>
		);
	}

	return (
		<Row>
			<Col span="8" offset="8">
				{render}
			</Col>
		</Row>
	);
}
