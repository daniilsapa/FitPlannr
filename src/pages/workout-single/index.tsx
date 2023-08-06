import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EntityId } from '@reduxjs/toolkit';
import {
	Alert,
	Button,
	Card,
	Checkbox,
	Col,
	Collapse,
	Divider,
	Form,
	FormListFieldData,
	Input,
	InputNumber,
	Popover,
	Row,
	Select,
	Space,
	Spin,
	Table,
	Tag,
	Tooltip,
} from 'antd';
import {
	CopyOutlined,
	DeleteOutlined,
	DoubleRightOutlined,
	GoogleOutlined,
	MinusCircleOutlined,
	PlusOutlined,
	QuestionCircleOutlined,
	SaveOutlined,
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { SortOrder } from 'antd/es/table/interface';
import { useIntl } from 'react-intl';

import { useAppDispatch, useAppSelector } from '../../app/hooks';

// Models
import {
	Day,
	NewWorkout,
	PlannedExercise,
	PlannedSet,
	Week,
	Workout,
} from '../../entities/workout/model';
import { Category } from '../../entities/category/model';
import { Exercise } from '../../entities/exercise/model';

// Slices
import {
	addWorkout,
	selectIsLoading as selectWorkoutsAreLoading,
	selectWorkoutById,
	updateWorkout,
} from '../../entities/workout/lib/workout-slice';
import {
	selectAllExercises,
	selectExerciseEntities,
	selectIsLoading as selectExercisesAreLoading,
} from '../../entities/exercise/lib/exercise-slice';
import {
	selectCategoryEntities,
	selectIsLoading as selectCategoriesAreLoading,
} from '../../entities/category/lib/category-slice';
import {
	selectAllClients,
	selectIsLoading as selectClientsAreLoading,
} from '../../entities/client/lib/client-slice';

// API
import { exportWorkout } from '../../entities/workout/api';

// Styles
import './index.css';
import { I18nMessage } from '../../shared/ui/i18n';

// ---
const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 40;
const MAX_DESCRIPTION_LENGTH = 1000;

const MAX_SETS_COUNT = 10;
const MAX_MARK_LENGTH = 5;
const MAX_REPEATS_COUNT = 50;
const MAX_TEMPO_LENGTH = 20;
const MAX_REST_LENGTH = 15;

interface WorkoutAddEditFormProps {
	onSubmit: (values: FormWorkout) => Promise<void>;
	onExport: () => Promise<void>;
	onDuplicate: () => void;
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
					{
						pattern: /^[0-9]+$/,
						message: 'Load must be a number',
					},
				]}
				initialValue={1}
			>
				<InputNumber placeholder="Sets" size="small" />
			</Form.Item>
			<Form.Item
				name={[name, 'load']}
				style={{ marginBottom: '8px' }}
				rules={[
					{
						required: true,
						message: 'Missing load',
					},
					{
						pattern: /^[0-9]+$/,
						message: 'Load must be a number',
					},
				]}
			>
				<Input placeholder="Load" size="small" />
			</Form.Item>
			<Form.Item
				name={[name, 'repeats']}
				style={{ marginBottom: '8px' }}
				rules={[
					{
						required: true,
						message: 'Missing repeats',
					},
					{
						pattern: /^[0-9]+$/,
						message: 'Repeats must be a number',
					},
					{
						validator: async (_, repeats) => {
							if (Number(repeats) > MAX_REPEATS_COUNT) {
								return Promise.reject();
							}
							return Promise.resolve();
						},
						message: `Max ${MAX_REPEATS_COUNT} repeats`,
					},
				]}
			>
				<InputNumber
					size="small"
					min={1}
					max={MAX_REPEATS_COUNT}
					placeholder="Repeats"
				/>
			</Form.Item>

			<Form.Item
				name={[name, 'tempo']}
				style={{ marginBottom: '8px' }}
				rules={[
					{
						max: MAX_TEMPO_LENGTH,
						message: `Name must be max ${MAX_TEMPO_LENGTH} characters long`,
					},
				]}
			>
				<Input placeholder="Tempo" size="small" />
			</Form.Item>

			<Form.Item
				name={[name, 'rest']}
				style={{ marginBottom: '8px' }}
				rules={[
					{
						max: MAX_REST_LENGTH,
						message: `Name must be max ${MAX_REST_LENGTH} characters long`,
					},
				]}
			>
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
	formFieldValues: FormPlannedExercise | null;
}

function ExerciseForm({ name, remove, formFieldValues }: ExerciseFormProps) {
	const exercises = useAppSelector(selectAllExercises);

	return (
		<div>
			<div>
				<Space style={{ width: '100%' }}>
					<Form.Item
						style={{ marginBottom: '8px' }}
						name={[name, 'mark']}
						rules={[
							{
								max: MAX_MARK_LENGTH,
								message: `Name must be max ${MAX_MARK_LENGTH} characters long`,
							},
						]}
					>
						<Input size="small" placeholder="Mark" style={{ width: 100 }} />
					</Form.Item>

					<Form.Item
						style={{ marginBottom: '8px' }}
						name={[name, 'exercise']}
						rules={[
							{
								required: true,
								message: 'Missing exercise',
							},
						]}
					>
						<Select size="small" showSearch style={{ width: 200 }}>
							{exercises.map((exercise) => (
								<Select.Option key={exercise._id} value={exercise._id}>
									{exercise.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Button size="small" onClick={() => remove(name)}>
						<DeleteOutlined />
					</Button>
				</Space>
			</div>
			<Form.List
				name={[name, 'sets']}
				rules={[
					{
						validator: async (_, sets) => {
							const totalSets = sets.reduce(
								(acc: number, curr: FormPlannedSet) =>
									curr ? acc + Number(curr.sets) : 0,
								0
							);
							if (totalSets > MAX_SETS_COUNT) {
								return Promise.reject();
							}

							return Promise.resolve();
						},
						message: `Max ${MAX_SETS_COUNT} sets`,
					},
				]}
			>
				{(fields, { add, remove: removeSet }, { errors }) => (
					<>
						{fields.map(({ key, name: setName }) => (
							<SetForm key={key} name={setName} remove={removeSet} />
						))}

						<div>
							<I18nMessage id="Workout.averageLoad" />:{' '}
							{formFieldValues
								? (
										formFieldValues.sets.reduce(
											(acc, curr: FormPlannedSet) =>
												curr ? acc + Number(curr.load) * curr.sets : 0,
											0
										) /
											formFieldValues.sets.reduce(
												(acc, curr: FormPlannedSet) =>
													curr ? acc + curr.sets : 0,
												0
											) || 0
								  ).toFixed(2)
								: 0}
						</div>

						<Form.Item>
							<Form.ErrorList errors={errors} helpStatus="error" />
						</Form.Item>

						<Button
							size="small"
							type="dashed"
							onClick={() => add()}
							icon={<PlusOutlined />}
						>
							<I18nMessage id="Workout.addSet" />
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
	const intl = useIntl();

	return (
		<div style={{ display: 'flex' }}>
			<Space.Compact onClick={(e) => e.stopPropagation()}>
				<Form.Item
					name={[name, 'dayTitle']}
					initialValue={`${intl.formatMessage({ id: 'Workout.day' })} ${
						index + 1
					}`}
					rules={[
						{
							required: true,
							message: 'Missing day title',
						},
						{
							max: 20,
							message: `Name must be max ${20} characters long`,
						},
						{
							min: MIN_TITLE_LENGTH,
							message: `Name must be min ${MIN_TITLE_LENGTH} characters long`,
						},
					]}
				>
					<Input />
				</Form.Item>

				<Button onClick={() => remove(name)}>
					<DeleteOutlined />
				</Button>
			</Space.Compact>
		</div>
	);
}

interface DayFormProps {
	name: number;
	formFieldValues: FormDay | null;
}

function DayForm({ name, formFieldValues }: DayFormProps) {
	return (
		<Form.List name={[name, 'exercises']}>
			{(fields, { add, remove }) => (
				<>
					{fields.map(({ key, name: exerciseName }, index) => (
						<ExerciseForm
							key={key}
							name={exerciseName}
							remove={remove}
							formFieldValues={
								formFieldValues ? formFieldValues.exercises[index] : null
							}
						/>
					))}

					<Button
						type="dashed"
						onClick={() => add()}
						block
						icon={<PlusOutlined />}
					>
						<I18nMessage id="Workout.addExercise" />
					</Button>
				</>
			)}
		</Form.List>
	);
}

interface WeekFormProps {
	field: FormListFieldData;
	index: number;
	formFieldValues: FormWeek | null;
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
	formFieldValues,
}: WeekFormProps) {
	const [open, setOpen] = useState(false);

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
	};

	const intl = useIntl();

	return (
		<Col span={12}>
			<Card
				title={
					<Space.Compact>
						<Form.Item
							name={[field.name, 'weekTitle']}
							style={{ marginBottom: 0 }}
							initialValue={`${intl.formatMessage({ id: 'Workout.week' })} ${
								index + 1
							}`}
							rules={[
								{
									required: true,
									message: 'Missing week title',
								},
								{
									max: 20,
									message: `Name must be max ${20} characters long`,
								},
								{
									min: MIN_TITLE_LENGTH,
									message: `Name must be min ${MIN_TITLE_LENGTH} characters long`,
								},
							]}
						>
							<Input />
						</Form.Item>
					</Space.Compact>
				}
				extra={
					<div style={{ display: 'flex', alignItems: 'center', gap: '0 8px' }}>
						<Button onClick={() => remove(field.name)}>
							<DeleteOutlined />
						</Button>
						<Popover
							content={
								<div>
									<Button onClick={onApplyToTheNext}>
										<I18nMessage id="Workout.form.applyToTheNextOne" />
									</Button>
									<Button onClick={onApplyToAll}>
										<I18nMessage id="Workout.form.applyToAll" />
									</Button>
								</div>
							}
							title={<I18nMessage id="Workout.form.transferSettingsTitle" />}
							trigger="click"
							open={open}
							onOpenChange={handleOpenChange}
						>
							<Button>
								<DoubleRightOutlined />
							</Button>
						</Popover>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								padding: '8px',
							}}
						>
							<Tooltip
								placement="topLeft"
								title={
									<I18nMessage id="Workout.form.selectForLoadCalculation" />
								}
							>
								<Form.Item name={[field.name, 'focused']} style={{ margin: 0 }}>
									<Checkbox />
								</Form.Item>
							</Tooltip>
						</div>
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
										extra: (
											<div>
												<Tooltip
													placement="topLeft"
													title={
														<I18nMessage id="Workout.form.selectForLoadCalculation" />
													}
												>
													<Form.Item
														name={[name, 'focused']}
														valuePropName="checked"
													>
														<Checkbox onClick={(e) => e.stopPropagation()} />
													</Form.Item>
												</Tooltip>
											</div>
										),
										children: (
											<DayForm
												name={name}
												formFieldValues={
													formFieldValues
														? formFieldValues.days[dayIndex]
														: null
												}
											/>
										),
									}))}
								/>
								<Button
									style={{ marginTop: '16px' }}
									type="dashed"
									onClick={() => add()}
									block
									icon={<PlusOutlined />}
								>
									<I18nMessage id="Workout.addDay" />
								</Button>
							</>
						)}
					</Form.List>
				</div>
			</Card>
		</Col>
	);
}

interface CategoryMetaData {
	tonnage: number;
	numberOfLifts: number;
}

function createCategoryToMetaData(categories: Category[]) {
	const categoryToMetaData: Record<string, CategoryMetaData> = {};

	return categories.reduce((acc, category) => {
		return {
			...acc,
			[category._id]: {
				tonnage: 0,
				numberOfLifts: 0,
			},
		};
	}, categoryToMetaData);
}

function calculateLoad(
	categoryMetas: Record<string, CategoryMetaData>,
	exercises: Record<string, Exercise>,
	plan: FormWeek[]
) {
	const categoryMetasCopy = structuredClone(categoryMetas);

	plan.forEach((week: FormWeek) => {
		week.days.forEach((day: FormDay) => {
			day.exercises.forEach((exercise: FormPlannedExercise) => {
				if (!exercise.exercise) {
					return;
				}
				const { sets } = exercise;
				const categoryIds = exercises[exercise.exercise].categories;

				categoryIds.forEach((categoryId) => {
					sets.forEach((set: FormPlannedSet) => {
						categoryMetasCopy[categoryId].tonnage +=
							(Number(set.load) ?? 0) * (set.repeats ?? 0) * (set.sets ?? 0);
						categoryMetasCopy[categoryId].numberOfLifts +=
							(set.repeats ?? 0) * (set.sets ?? 0);
					});
				});
			});
		});
	});

	return categoryMetasCopy;
}

interface LoadCalculatorProps {
	categories: Record<string, Category>;
	exercises: Record<string, Exercise>;
	plan: FormWeek[];
}

function withDisabled(
	sorter: (
		a: CategoryWithMetaAndDisabled,
		b: CategoryWithMetaAndDisabled
	) => 1 | -1 | number
) {
	return (
		a: CategoryWithMetaAndDisabled,
		b: CategoryWithMetaAndDisabled,
		sortOrder?: SortOrder
	) => {
		if (a.disabled && b.disabled) {
			return sorter(a, b);
		}

		if (a.disabled) {
			if (!sortOrder) {
				return 1;
			}
			return sortOrder === 'ascend' ? 1 : -1;
		}

		if (b.disabled) {
			if (!sortOrder) {
				return -1;
			}
			return sortOrder === 'ascend' ? -1 : 1;
		}

		return sorter(a, b);
	};
}

type CategoryWithMetaAndDisabled = Category & {
	meta: CategoryMetaData;
	disabled: boolean;
};

function LoadCalculator({ categories, exercises, plan }: LoadCalculatorProps) {
	const [disabledCategories, setDisabledCategories] = useState<
		Record<string, boolean>
	>({});
	const categoryToMetaData = createCategoryToMetaData(
		Object.values(categories)
	);
	const categoryMetas = calculateLoad(categoryToMetaData, exercises, plan);
	const items: CategoryWithMetaAndDisabled[] = Object.entries(categoryMetas)
		.map(
			([categoryId, categoryMeta]): CategoryWithMetaAndDisabled => ({
				_id: categoryId,
				name: categories[categoryId].name,
				color: categories[categoryId].color,
				meta: categoryMeta,
				disabled: disabledCategories[categoryId],
			})
		)
		.sort(
			withDisabled(
				(a: CategoryWithMetaAndDisabled, b: CategoryWithMetaAndDisabled) =>
					a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
			)
		);

	const handleCheckboxChange = (category: Category, checked: boolean) => {
		setDisabledCategories({
			...disabledCategories,
			[category._id]: checked,
		});
	};

	const columns: ColumnsType<CategoryWithMetaAndDisabled> = [
		{
			title: <I18nMessage id="Category.category" />,
			dataIndex: 'name',
			render: (text, record: Category) => (
				<Space>
					<Tag color={record.color}>{text}</Tag>
				</Space>
			),
		},
		{
			title: <I18nMessage id="Workout.numberOfLiftsAbbr" />,
			dataIndex: 'meta',
			defaultSortOrder: 'descend',
			render: (meta) => meta.numberOfLifts,
			sorter: (aCat, bCat, sortOrder) =>
				withDisabled((a, b) => a.meta.numberOfLifts - b.meta.numberOfLifts)(
					aCat,
					bCat,
					sortOrder
				),
		},
		{
			title: <I18nMessage id="Workout.tonnage" />,
			dataIndex: 'meta',
			render: (meta) => meta.tonnage,
			sorter: (aCat, bCat, sortOrder) =>
				withDisabled((a, b) => a.meta.tonnage - b.meta.tonnage)(
					aCat,
					bCat,
					sortOrder
				),
		},
		{
			title: <I18nMessage id="Common.disabledAbbr" />,
			dataIndex: '_id',
			render: (_, category) => (
				<Space>
					<Checkbox
						checked={category.disabled}
						onChange={(e) => handleCheckboxChange(category, e.target.checked)}
					/>
				</Space>
			),
		},
	];

	return (
		<Table
			bordered
			size="small"
			caption={
				<h3>
					<I18nMessage id="Workout.loadCalculator" />
				</h3>
			}
			showHeader
			pagination={false}
			scroll={{ y: 405 }}
			rowClassName={(record) => (record.disabled ? 'row-disabled' : '')}
			columns={columns}
			dataSource={items}
		/>
	);
}

type FormPlannedSet = PlannedSet & { sets: number };
type FormPlannedExercise = PlannedExercise & { sets: FormPlannedSet[] };
type FormDay = Day & {
	exercises: FormPlannedExercise[];
	focused: boolean;
};
type FormWeek = Week & { days: FormDay[]; focused: boolean };
type FormWorkout = Workout & { plan: FormWeek[] };

function pickEntitiesWithFocus(plan: FormWeek[]): FormWeek[] {
	const newPlan = plan
		.map((week: FormWeek) => {
			if (week.focused) {
				return week;
			}

			const newDays = week.days
				.map((day: FormDay) => {
					if (day.focused) {
						return day;
					}

					return undefined;
				})
				.filter((day) => day) as FormDay[];

			if (newDays.length === 0) {
				return undefined;
			}

			return {
				...week,
				days: newDays,
			};
		})
		.filter((week) => week) as FormWeek[];

	return newPlan.length === 0 ? plan : newPlan;
}

function WorkoutAddEditForm({
	isPending,
	error,
	onSubmit,
	onExport,
	onDuplicate,
	initialValues,
	clearAfterSubmit,
}: WorkoutAddEditFormProps) {
	const categories = useAppSelector(selectCategoryEntities) as Record<
		string,
		Category
	>;
	const exercise = useAppSelector(selectExerciseEntities) as Record<
		string,
		Exercise
	>;
	const clients = useAppSelector(selectAllClients);
	const [state, setState] = useState<FormWeek[]>([]);
	const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
	const intl = useIntl();

	const [form] = Form.useForm();

	const handleSubmit = async (values: FormWorkout) => {
		await onSubmit(values);
		if (clearAfterSubmit) {
			form.resetFields();
		}
	};

	const handleClientChange = (clientId: string) => {
		setSelectedClientId(clientId);
	};

	const turnLoadPercentsIntoAbsoluteNumber = (formValues: {
		plan: FormWeek[];
	}) => {
		return {
			...formValues,
			plan: formValues.plan.map((week) =>
				week
					? {
							...week,
							days: week.days.map((day) =>
								day
									? {
											...day,
											exercises: (day.exercises || []).map((e) =>
												e
													? {
															...e,
															sets: e.sets.map((set) => {
																if (!set) {
																	return set;
																}

																const newLoadValue = set.load;

																if (
																	set.load &&
																	set.load.indexOf('%') > -1 &&
																	selectedClientId
																) {
																	const client = clients.find(
																		(c) => c._id === selectedClientId
																	);

																	const record = client?.personalRecords?.find(
																		(pr) => pr.exercise === e.exercise
																	);

																	if (record) {
																		return {
																			...set,
																			load: String(
																				(parseInt(set.load, 10) / 100) *
																					record.record
																			),
																		};
																	}
																}

																return {
																	...set,
																	load: newLoadValue,
																};
															}),
													  }
													: e
											),
									  }
									: day
							),
					  }
					: week
			),
		};
	};

	const handleValuesChange = (_: unknown, allValues: { plan: FormWeek[] }) => {
		const newState = allValues.plan
			.filter((week: Week | undefined) => week)
			.map((week: Week) => ({
				...week,
				days: week.days
					.filter((day: Day | undefined) => day)
					.map((day) => ({
						...day,
						exercises: (day.exercises || [])
							.filter((e: PlannedExercise) => e)
							.map((e: PlannedExercise) => ({
								...e,
								sets: e.sets.filter((set) => set),
							})),
					})),
			})) as FormWeek[];

		form.setFieldsValue(turnLoadPercentsIntoAbsoluteNumber(allValues));
		setState(newState);
	};

	useEffect(() => {
		handleValuesChange(null, { plan: form.getFieldsValue().plan });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleExport = () => {
		form.validateFields().then(async (values) => {
			await onSubmit(values);
			await onExport();
		});
	};

	const handleDuplicate = () => {
		form.validateFields().then(async (values) => {
			await onSubmit(values);
			form.setFieldValue(
				'title',
				`${form.getFieldValue('title')} (${intl.formatMessage({
					id: 'Common.copy',
				})})`
			);
			await onDuplicate();
		});
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
		handleValuesChange(null, { plan: newPlan });
	};

	const handleApplyToAll = (weekIndex: number) => {
		const prevPlanState = form.getFieldValue('plan');
		const weekToApply = structuredClone(prevPlanState[weekIndex]);
		const newPlan = prevPlanState.map(() => weekToApply);

		form.setFieldsValue({
			plan: newPlan,
		});

		handleValuesChange(null, { plan: newPlan });
	};

	return (
		<Spin spinning={isPending}>
			<Form
				form={form}
				initialValues={initialValues}
				onFinish={handleSubmit}
				onValuesChange={handleValuesChange}
				validateTrigger="onSubmit"
				layout="vertical"
				scrollToFirstError
			>
				<div style={{ margin: '0 2em' }}>
					{error && <Alert type="error" message={error} banner />}

					<Row>
						<Col span="10" offset="7">
							<Space
								direction="horizontal"
								style={{ width: '100%', justifyContent: 'center' }}
							>
								<Form.Item>
									<Button type="default" block onClick={handleExport}>
										<GoogleOutlined />{' '}
										<I18nMessage id="Workout.form.saveAndExport" />
									</Button>
								</Form.Item>

								<Form.Item>
									<Button type="default" block onClick={handleDuplicate}>
										<CopyOutlined />{' '}
										<I18nMessage id="Workout.form.saveAndDuplicate" />
									</Button>
								</Form.Item>

								<Form.Item>
									<Button block htmlType="submit">
										<SaveOutlined /> <I18nMessage id="Workout.form.save" />
									</Button>
								</Form.Item>
							</Space>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span="4" offset="4">
							<div style={{ padding: '0 0 0 4.2em' }}>
								<Form.Item
									label={<I18nMessage id="Client.client" />}
									tooltip={{
										title: (
											<I18nMessage id="Workout.form.selectClientTooltip" />
										),
										icon: <QuestionCircleOutlined />,
										placement: 'topLeft',
									}}
								>
									<Select
										size="small"
										showSearch
										style={{ width: 200 }}
										onChange={handleClientChange}
									>
										{clients.map((client) => (
											<Select.Option key={client._id} value={client._id}>
												{client.name}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</div>
						</Col>

						<Col span="8">
							<Form.Item
								label={<I18nMessage id="Workout.title" />}
								name="title"
								rules={[
									{
										required: true,
										message: 'Please enter a name for the workout',
									},
									{
										min: MIN_TITLE_LENGTH,
										message: `Name must be at least ${MIN_TITLE_LENGTH} characters long`,
									},
									{
										max: MAX_TITLE_LENGTH,
										message: `Name must be max ${MAX_TITLE_LENGTH} characters long`,
									},
								]}
							>
								<Input showCount maxLength={MAX_TITLE_LENGTH} />
							</Form.Item>

							<Form.Item
								label={<I18nMessage id="Workout.description" />}
								name="description"
								rules={[
									{
										max: MAX_DESCRIPTION_LENGTH,
										message: `Description must be max ${MAX_DESCRIPTION_LENGTH} characters long`,
									},
								]}
							>
								<Input.TextArea showCount maxLength={MAX_DESCRIPTION_LENGTH} />
							</Form.Item>
						</Col>
					</Row>
				</div>

				<div style={{ margin: '2em 2em 0' }}>
					<Row gutter={[16, 16]}>
						<Col span={18}>
							<Row gutter={[16, 16]}>
								<Form.List name="plan">
									{(fields, { add, remove }) => (
										<>
											{fields.map((field, index) => (
												<WeekForm
													formFieldValues={
														form.getFieldsValue().plan
															? form.getFieldsValue().plan[index]
															: null
													}
													key={field.key}
													field={field}
													remove={remove}
													index={index}
													onApplyToTheNext={() => handleApplyToTheNext(index)}
													onApplyToAll={() => handleApplyToAll(index)}
												/>
											))}

											<Col span={12}>
												<Form.Item>
													<Button
														type="dashed"
														onClick={() => add()}
														block
														style={{ height: '405px' }}
														icon={<PlusOutlined />}
													>
														<I18nMessage id="Workout.addWeek" />
													</Button>
												</Form.Item>
											</Col>
										</>
									)}
								</Form.List>
							</Row>
						</Col>
						<Col span={6}>
							<LoadCalculator
								categories={categories}
								exercises={exercise}
								plan={pickEntitiesWithFocus(state)}
							/>
						</Col>
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

interface ApiError {
	message: string;
	response?: {
		data?: {
			message: string;
		};
	};
}

const combineSimilarSets = (sets: PlannedSet[]): FormPlannedSet[] => {
	const theSame = (a: PlannedSet, b: PlannedSet) => {
		return (
			a.load === b.load &&
			a.repeats === b.repeats &&
			a.tempo === b.tempo &&
			a.rest === b.rest
		);
	};
	return sets.reduce((acc: FormPlannedSet[], set: PlannedSet) => {
		if (acc[acc.length - 1] && theSame(acc[acc.length - 1], set)) {
			return [
				...acc.slice(0, acc.length - 1),
				{ ...set, sets: acc[acc.length - 1].sets + 1 },
			];
		}
		return [...acc, { ...set, sets: 1 }];
	}, []);
};

const prepareInitialValues = (workout: Workout) => {
	const plan = workout.plan.map((week) => {
		const days = week.days.map((day) => {
			const exercises = day.exercises.map((exercise) => {
				const sets = combineSimilarSets(exercise.sets);
				return { ...exercise, sets };
			});
			return { ...day, exercises };
		});
		return { ...week, days };
	});
	return { ...workout, plan };
};

export default function WorkoutSinglePage() {
	const loading = useAppSelector(
		(state) =>
			selectExercisesAreLoading(state) &&
			selectCategoriesAreLoading(state) &&
			selectClientsAreLoading(state) &&
			selectWorkoutsAreLoading(state)
	);
	const navigate = useNavigate();
	const { id } = useParams();
	const stored = useAppSelector((state) =>
		selectWorkoutById(state, id as EntityId)
	) as Workout;
	const dispatch = useAppDispatch();
	const [isPending, setIsPending] = React.useState(false);
	const [error, setError] = React.useState('');
	const initialWorkout =
		id && stored
			? prepareInitialValues(stored)
			: { title: '', description: '', plan: [] };

	const handleExport = async () => {
		try {
			if (id) {
				await exportWorkout(id);
			}
		} catch (e) {
			// TODO: move error extraction to api layer and remove the workaround
			const err = e as ApiError;
			setError(err?.response?.data?.message || err.message);
			setIsPending(false);
		}
	};

	const handleSubmit = async (values: FormWorkout) => {
		if (isPending) return;

		const preparedValues: Week[] = values.plan.map((week: FormWeek) =>
			week && week.days
				? {
						...week,
						days: week.days.map((day: FormDay) =>
							day && day.exercises
								? {
										...day,
										exercises: day.exercises.map(
											(exercise: FormPlannedExercise) =>
												exercise && exercise.sets
													? {
															...exercise,
															sets: exercise.sets.reduce(
																(acc: PlannedSet[], set: FormPlannedSet) => {
																	const { sets, ...rest } = set;
																	if (sets > 1) {
																		return [...acc, ...Array(sets).fill(rest)];
																	}
																	return [...acc, rest];
																},
																[]
															),
													  }
													: exercise
										),
								  }
								: day
						),
				  }
				: week
		);

		setIsPending(true);
		try {
			await (id
				? dispatch(
						updateWorkout({
							...stored,
							...values,
							plan: preparedValues,
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

	const handleDuplicate = () => {
		navigate('/workout');
	};

	let render = null;

	if (loading) {
		render = (
			<Spin tip="Loading" size="small">
				<div className="content" />
			</Spin>
		);
	} else if (id && !stored) {
		render = (
			<Row>
				<Col span="8" offset="8">
					<Alert type="error" message="Workout not found" banner />
				</Col>
			</Row>
		);
	} else {
		render = (
			<WorkoutAddEditForm
				isPending={isPending}
				error={error}
				initialValues={initialWorkout}
				onSubmit={handleSubmit}
				onExport={handleExport}
				onDuplicate={handleDuplicate}
				clearAfterSubmit={!id}
			/>
		);
	}

	return <div>{render}</div>;
}
