import React from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, Col, Row, Spin, Alert, Tag, Select } from 'antd';
import { EntityId } from '@reduxjs/toolkit';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
	updateExercise,
	addExercise,
	selectExerciseById,
	selectIsLoading as selectExercisesAreLoading,
} from '../../entities/exercise/lib/exercise-slice';
import { Exercise, NewExercise } from '../../entities/exercise/model';
import {
	selectAllCategories,
	selectIsLoading as selectCategoriesAreLoading,
} from '../../entities/category/lib/category-slice';
import { I18nMessage } from '../../shared/ui/i18n';

// ---

interface ExerciseForm {
	name: string;
	description: string;
	categories: string[];
	link: string;
}

interface ExerciseAddEditFormProps {
	onSubmit: (values: ExerciseForm) => Promise<void>;
	isPending: boolean;
	error?: string;
	initialValues: NewExercise;
	clearAfterSubmit?: boolean;
}

function ExerciseAddEditForm({
	isPending,
	error,
	onSubmit,
	initialValues,
	clearAfterSubmit,
}: ExerciseAddEditFormProps) {
	const [form] = Form.useForm();
	const allCategories = useAppSelector(selectAllCategories);

	const handleSubmit = async (values: ExerciseForm) => {
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
					label={<I18nMessage id="Exercise.name" />}
					name="name"
					rules={[
						{
							required: true,
							message: 'Please enter a name for the exercise',
						},
						{ min: 3, message: 'Name must be at least 3 characters long' },
						{ max: 40, message: 'Name must be max 20 characters long' },
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label={<I18nMessage id="Exercise.description" />}
					name="description"
					rules={[
						{
							max: 1000,
							message: 'Description must be max 100 characters long',
						},
					]}
				>
					<Input.TextArea />
				</Form.Item>

				<Form.Item
					name="categories"
					label={<I18nMessage id="Category.categories" />}
				>
					<Select mode="multiple">
						{allCategories.map((category) => (
							<Select.Option key={category._id} value={category._id}>
								<div>
									<Tag color={category.color}>{category.name}</Tag>
								</div>
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item
					label={<I18nMessage id="Exercise.link" />}
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
						<I18nMessage id="Common.save" />
					</Button>
				</Form.Item>
			</Form>
		</Spin>
	);
}

ExerciseAddEditForm.defaultProps = {
	clearAfterSubmit: false,
	error: undefined,
};

export default function ExerciseSinglePage() {
	const loading = useAppSelector(
		(state) =>
			selectExercisesAreLoading(state) || selectCategoriesAreLoading(state)
	);
	const { id } = useParams();
	const stored = useAppSelector((state) =>
		selectExerciseById(state, id as EntityId)
	) as Exercise;
	const dispatch = useAppDispatch();
	const [isPending, setIsPending] = React.useState(false);
	const [error, setError] = React.useState('');
	const initialExercise =
		id && stored
			? stored
			: { name: '', description: '', categories: [], link: '' };

	const handleSubmit = async (values: ExerciseForm) => {
		if (isPending) return;

		setIsPending(true);
		try {
			await (id
				? dispatch(
						updateExercise({
							...stored,
							...values,
						})
				  )
				: dispatch(addExercise(values))
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
		render = <Alert type="error" message="Exercise not found" banner />;
	} else {
		render = (
			<ExerciseAddEditForm
				isPending={isPending}
				error={error}
				initialValues={{
					name: initialExercise.name,
					description: initialExercise.description,
					categories: initialExercise.categories,
					link: initialExercise.link,
				}}
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
