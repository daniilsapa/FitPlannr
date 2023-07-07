import React, { useState } from 'react';
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
	Collapse,
	Card,
	InputNumber,
	Select,
	Divider,
	Popover,
	FormListFieldData,
} from 'antd';
import {
	DeleteOutlined,
	DoubleRightOutlined,
	MinusCircleOutlined,
	PlusOutlined,
} from '@ant-design/icons';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
	updateWorkout,
	addWorkout,
	selectWorkoutById,
} from '../../entities/workout/lib/workout-slice';
import { Workout, NewWorkout, Week } from '../../entities/workout/model';
import { selectAllExercises } from '../../entities/exercise/lib/exercise-slice';

// ---

interface WorkoutAddEditFormProps {
	onSubmit: (values: NewWorkout) => Promise<void>;
	isPending: boolean;
	error?: string;
	initialValues: NewWorkout;
	clearAfterSubmit?: boolean;
}

interface SetFormProps {
	name: number;
	remove: (name: number) => void;
}

function SetForm({ name, remove }: SetFormProps) {
	return (
		<div style={{ display: 'flex', gap: '10px' }}>
			<Form.Item
				name={[name, 'sets']}
				style={{ marginBottom: '8px' }}
				rules={[
					{
						required: true,
						message: 'Missing sets number',
					},
				]}
				initialValue={1}
			>
				<InputNumber placeholder="Sets" size="small" />
			</Form.Item>

			<Form.Item name={[name, 'load']} style={{ marginBottom: '8px' }}>
				<Input placeholder="Load" size="small" />
			</Form.Item>

			<Form.Item name={[name, 'repeats']} style={{ marginBottom: '8px' }}>
				<InputNumber size="small" min={1} max={10} placeholder="Repeats" />
			</Form.Item>

			<Form.Item name={[name, 'tempo']} style={{ marginBottom: '8px' }}>
				<Input placeholder="Tempo" size="small" />
			</Form.Item>

			<Form.Item name={[name, 'rest']} style={{ marginBottom: '8px' }}>
				<Input placeholder="Rest" size="small" />
			</Form.Item>

			<Button
				size="small"
				type="text"
				style={{ marginTop: '4px' }}
				onClick={() => remove(name)}
				icon={<MinusCircleOutlined />}
			/>
		</div>
	);
}

interface ExerciseFormProps {
	name: number;
	remove: (name: number) => void;
}

function ExerciseForm({ name, remove }: ExerciseFormProps) {
	const exercises = useAppSelector(selectAllExercises);

	return (
		<div>
			<div>
				<Space style={{ width: '100%' }}>
					<Form.Item style={{ marginBottom: '8px' }} name={[name, 'mark']}>
						<Input size="small" placeholder="Mark" style={{ width: 100 }} />
					</Form.Item>
					<Form.Item
						style={{ marginBottom: '8px' }}
						name={[name, 'exerciseId']}
					>
						<Select size="small" showSearch style={{ width: 200 }}>
							{exercises.map((exercise) => (
								<Select.Option key={exercise._id} value={exercise._id}>
									{exercise.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Button onClick={() => remove(name)}>
						<DeleteOutlined />
					</Button>
				</Space>
			</div>
			<Form.List name={[name, 'sets']}>
				{(fields, { add, remove: removeSet }) => (
					<>
						{fields.map(({ key, name: setName }) => (
							<SetForm key={key} name={setName} remove={removeSet} />
						))}

						<Button
							size="small"
							type="dashed"
							onClick={() => add()}
							icon={<PlusOutlined />}
						>
							Add a set
						</Button>
					</>
				)}
			</Form.List>
			<Divider />
		</div>
	);
}

interface DayTitleFormProps {
	name: number;
	index: number;
	remove: (name: number | number[]) => void;
}

function DayTitleForm({ name, index, remove }: DayTitleFormProps) {
	return (
		<Space.Compact onClick={(e) => e.stopPropagation()}>
			<Form.Item name={[name, 'dayTitle']} initialValue={`Day ${index + 1}`}>
				<Input />
			</Form.Item>

			<Button onClick={() => remove(name)}>
				<DeleteOutlined />
			</Button>
		</Space.Compact>
	);
}

interface DayFormProps {
	name: number;
}

function DayForm({ name }: DayFormProps) {
	return (
		<Form.List name={[name, 'exercises']}>
			{(fields, { add, remove }) => (
				<>
					{fields.map(({ key, name: exerciseName }) => (
						<ExerciseForm key={key} name={exerciseName} remove={remove} />
					))}
					<Button
						type="dashed"
						onClick={() => add()}
						block
						icon={<PlusOutlined />}
					>
						Add exercises
					</Button>
				</>
			)}
		</Form.List>
	);
}

interface WeekFormProps {
	field: FormListFieldData;
	index: number;
	remove: (name: number | number[]) => void;
	onApplyToTheNext: () => void;
	onApplyToAll: () => void;
}

function WeekForm({
	field,
	index,
	remove,
	onApplyToTheNext,
	onApplyToAll,
}: WeekFormProps) {
	const [open, setOpen] = useState(false);

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
	};

	return (
		<Col span={8}>
			<Card
				title={
					<Space.Compact>
						<Form.Item
							name={[field.name, 'weekTitle']}
							style={{ marginBottom: 0 }}
							initialValue={`Week ${index + 1}`}
						>
							<Input />
						</Form.Item>
					</Space.Compact>
				}
				extra={
					<div>
						<Button onClick={() => remove(field.name)}>
							<DeleteOutlined />
						</Button>
						<Popover
							content={
								<div>
									<Button onClick={onApplyToTheNext}>Apply to the next</Button>
									<Button onClick={onApplyToAll}>Apply to all</Button>
								</div>
							}
							title="Title"
							trigger="click"
							open={open}
							onOpenChange={handleOpenChange}
						>
							<Button>
								<DoubleRightOutlined />
							</Button>
						</Popover>
					</div>
				}
			>
				<div style={{ height: '300px', overflow: 'auto' }}>
					<Form.List name={[field.name, 'days']}>
						{(fields, { add, remove: removeDay }) => (
							<>
								<Collapse
									items={fields.map(({ key, name }, dayIndex) => ({
										key,
										label: (
											<DayTitleForm
												name={name}
												index={dayIndex}
												remove={removeDay}
											/>
										),
										children: <DayForm name={name} />,
									}))}
								/>
								<Button
									style={{ marginTop: '16px' }}
									type="dashed"
									onClick={() => add()}
									block
									icon={<PlusOutlined />}
								>
									Add days
								</Button>
							</>
						)}
					</Form.List>
				</div>
			</Card>
		</Col>
	);
}

function WorkoutAddEditForm({
	isPending,
	error,
	onSubmit,
	initialValues,
	clearAfterSubmit,
}: WorkoutAddEditFormProps) {
	const [form] = Form.useForm();

	const handleSubmit = async (values: NewWorkout) => {
		await onSubmit(values);
		if (clearAfterSubmit) {
			form.resetFields();
		}
	};

	const omit = (obj: Record<string, unknown>, omitKey: string) => {
		return Object.keys(obj).reduce((result, key) => {
			if (key !== omitKey) {
				return {
					...result,
					[key]: obj[key],
				};
			}
			return result;
		}, {});
	};

	const prepareWeek = (week: Week) => {
		const newWeek = structuredClone(week);
		return omit(newWeek, 'weekTitle');
	};

	const handleApplyToTheNext = (weekIndex: number) => {
		const prevPlanState = form.getFieldValue('plan');
		const newPlan = [...prevPlanState];
		const weekToApply = prepareWeek(newPlan[weekIndex]);

		if (newPlan[weekIndex + 1]) {
			newPlan[weekIndex + 1] = weekToApply;
		} else {
			newPlan.push(weekToApply);
		}

		form.setFieldsValue({
			plan: newPlan,
		});
	};

	const handleApplyToAll = (weekIndex: number) => {
		const prevPlanState = form.getFieldValue('plan');
		const weekToApply = structuredClone(prevPlanState[weekIndex]);
		const newPlan = prevPlanState.map(() => weekToApply);

		form.setFieldsValue({
			plan: newPlan,
		});
	};

	return (
		<Spin spinning={isPending} delay={200}>
			<Form
				form={form}
				initialValues={initialValues}
				onFinish={handleSubmit}
				validateTrigger="onSubmit"
				layout="vertical"
			>
				{error && <Alert type="error" message={error} banner />}

				<Form.Item>
					<Button htmlType="submit">submit</Button>
				</Form.Item>

				<Row>
					<Col span="8" offset="8">
						<Form.Item
							label="Title"
							name="title"
							rules={[
								{
									required: true,
									message: 'Please enter a name for the workout',
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
									message: 'Description must be max 1000 characters long',
								},
							]}
						>
							<Input.TextArea showCount maxLength={1000} />
						</Form.Item>
					</Col>
				</Row>

				<div style={{ margin: '0 2em' }}>
					<Row gutter={[16, 16]}>
						<Form.List name="plan">
							{(fields, { add, remove }) => (
								<>
									{fields.map((field, index) => (
										<WeekForm
											key={field.key}
											field={field}
											remove={remove}
											index={index}
											onApplyToTheNext={() => handleApplyToTheNext(index)}
											onApplyToAll={() => handleApplyToAll(index)}
										/>
									))}

									<Col span={8}>
										<Form.Item>
											<Button
												type="dashed"
												onClick={() => add()}
												block
												style={{ height: '405px' }}
												icon={<PlusOutlined />}
											>
												Add another week
											</Button>
										</Form.Item>
									</Col>
								</>
							)}
						</Form.List>
					</Row>
				</div>
			</Form>
		</Spin>
	);
}

WorkoutAddEditForm.defaultProps = {
	clearAfterSubmit: false,
	error: undefined,
};

export default function WorkoutSinglePage() {
	const { id } = useParams();
	const stored = useAppSelector((state) =>
		selectWorkoutById(state, id as EntityId)
	) as Workout;
	const dispatch = useAppDispatch();
	const [isPending, setIsPending] = React.useState(false);
	const [error, setError] = React.useState('false');
	const initialWorkout =
		id && stored ? stored : { title: '', description: '', plan: [] };

	const handleSubmit = async (values: NewWorkout) => {
		if (isPending) return;

		setIsPending(true);
		try {
			await (id
				? dispatch(
						updateWorkout({
							...stored,
							...values,
						})
				  )
				: dispatch(addWorkout(values))
			).unwrap();
		} catch (err) {
			const e = err as Error;
			setError(e.message);
		}

		setIsPending(false);
	};

	return (
		<div>
			<WorkoutAddEditForm
				isPending={isPending}
				error={error}
				initialValues={initialWorkout}
				onSubmit={handleSubmit}
				clearAfterSubmit={!id}
			/>
		</div>
	);
}
