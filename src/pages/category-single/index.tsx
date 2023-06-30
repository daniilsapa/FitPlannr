import React from 'react';
import { useParams } from 'react-router-dom';
import { Form, ColorPicker, Input, Button, Col, Row, Spin, Alert } from 'antd';
import { Color } from 'antd/es/color-picker';
import { EntityId } from '@reduxjs/toolkit';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
	updateCategory,
	addCategory,
	selectCategoryById,
} from '../../entities/category/lib/categorySlice';
import { Category, NewCategory } from '../../entities/category/model';

// ---

interface CategoryFormInternal {
	name: string;
	color: string | Color;
}

interface CategoryForm {
	name: string;
	color: string;
}

interface CategoryAddEditFormProps {
	onSubmit: (values: CategoryForm) => Promise<void>;
	isPending: boolean;
	error?: string;
	initialValues: NewCategory;
	clearAfterSubmit?: boolean;
}

function CategoryAddEditForm({
	isPending,
	error,
	onSubmit,
	initialValues,
	clearAfterSubmit,
}: CategoryAddEditFormProps) {
	const [form] = Form.useForm();

	const handleSubmit = async (values: CategoryFormInternal) => {
		const { color } = values;
		await onSubmit({
			name: values.name,
			color: typeof color === 'string' ? color : `#${color.toHex()}`,
		});
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
				initialValues={{
					name: initialValues.name,
					color: initialValues.color,
				}}
			>
				{error && <Alert type="error" message={error} banner />}

				<Form.Item
					label="Category name"
					name="name"
					rules={[
						{
							required: true,
							message: 'Please enter a name for the category',
						},
						{ min: 3, message: 'Name must be at least 3 characters long' },
						{ max: 20, message: 'Name must be max 20 characters long' },
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Category color"
					name="color"
					rules={[{ required: true, message: 'Please select a color' }]}
				>
					<ColorPicker format="hex" />
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

CategoryAddEditForm.defaultProps = {
	clearAfterSubmit: false,
	error: undefined,
};

export default function CategorySinglePage() {
	const { id } = useParams();
	const stored = useAppSelector((state) =>
		selectCategoryById(state, id as EntityId)
	) as Category;
	const dispatch = useAppDispatch();
	const [isPending, setIsPending] = React.useState(false);
	const [error, setError] = React.useState('false');
	const initialCategory = id && stored ? stored : { name: '', color: '#000' };

	const handleSubmit = async (values: CategoryForm) => {
		if (isPending) return;

		setIsPending(true);
		try {
			await (id
				? dispatch(
						updateCategory({
							...stored,
							...values,
						})
				  )
				: dispatch(addCategory(values))
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
				<CategoryAddEditForm
					isPending={isPending}
					error={error}
					initialValues={{
						name: initialCategory.name,
						color: initialCategory.color,
					}}
					onSubmit={handleSubmit}
					clearAfterSubmit={!id}
				/>
			</Col>
		</Row>
	);
}
