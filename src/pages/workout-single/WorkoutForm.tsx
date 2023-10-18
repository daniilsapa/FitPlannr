import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import {
	Alert,
	Button,
	Col,
	Form,
	Input,
	Row,
	Select,
	Space,
	Spin,
} from 'antd';
import {
	CopyOutlined,
	GoogleOutlined,
	PlusOutlined,
	QuestionCircleOutlined,
	SaveOutlined,
} from '@ant-design/icons';

import { useAppSelector } from '../../app/hooks';
import { selectCategoryEntities } from '../../entities/category/lib/category-slice';
import { Category } from '../../entities/category/model';
import { selectExerciseEntities } from '../../entities/exercise/lib/exercise-slice';
import { Exercise } from '../../entities/exercise/model';
import { selectAllClients } from '../../entities/client/lib/client-slice';
import { FormDay, FormWeek, FormWorkout } from './types';

import modifyWorkout from '../../entities/workout/lib/modify-workout/modify-workout';
import {
	Day,
	NewWorkout,
	PlannedExercise,
	PlannedSet,
	Week,
	Workout,
} from '../../entities/workout/model';

// UI

import { I18nMessage } from '../../shared/ui/i18n';
import { MAX_TITLE_LENGTH, MIN_TITLE_LENGTH } from './constants';
import WeekForm from './WeekForm';
import LoadCalculator from './LoadCalculator';
import MobileView from './MobileView';
import { AddToFlowButton } from '../../features/workout/flow';

// ---

const MAX_DESCRIPTION_LENGTH = 1000;

interface WorkoutAddEditFormProps {
	onSubmit: (values: FormWorkout) => Promise<void>;
	onExport: () => Promise<void>;
	onDuplicate: () => void;
	isPending: boolean;
	error?: string;
	initialValues: NewWorkout;
	clearAfterSubmit?: boolean;
}

function pickEntitiesWithFocus(plan: FormWeek[]): FormWeek[] {
	const newPlan = plan
		.map((week: FormWeek) => {
			if (!week || week.focused) {
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

export default function WorkoutAddEditForm({
	isPending,
	error,
	onSubmit,
	onExport,
	onDuplicate,
	initialValues,
	clearAfterSubmit,
}: WorkoutAddEditFormProps) {
	// @ts-ignore
	const workoutId = initialValues?._id;
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

	const turnLoadPercentsIntoAbsoluteNumber = (formValues: FormWorkout) => {
		return {
			...modifyWorkout(formValues, {
				onExercise: (e?: PlannedExercise) => {
					if (!e) {
						return e;
					}

					return {
						...e,
						sets: e.sets.map((set: PlannedSet) => {
							const newLoadValue = set.load;

							if (set.load && set.load.indexOf('%') > -1 && selectedClientId) {
								const client = clients.find((c) => c._id === selectedClientId);

								const record = client?.personalRecords?.find(
									(pr) => pr.exercise === e.exercise
								);

								if (record) {
									return {
										...set,
										load: String(
											(parseInt(set.load, 10) / 100) * record.record
										),
									};
								}
							}

							return {
								...set,
								load: newLoadValue,
							};
						}),
					};
				},
			}),
		};
	};

	const handleValuesChange = (_: unknown, allValues: FormWorkout) => {
		const newValues = modifyWorkout(allValues, {
			onExercise: (exer?: PlannedExercise) => {
				if (!exer) {
					return exer;
				}

				return {
					...exer,
					sets: exer.sets ? exer.sets.filter((set) => set) : [],
				};
			},
			onDay: (day?: Day) => {
				if (!day) {
					return day;
				}

				return {
					...day,
					exercises: day.exercises ? day.exercises.filter((e) => e) : [],
				};
			},
			onWeek: (week?: Week) => {
				if (!week) {
					return week;
				}

				return {
					...week,
					days: week.days ? week.days.filter((day) => day) : [],
				};
			},
			onWorkout: (workout?: Workout) => {
				if (!workout) {
					return workout;
				}

				return {
					...workout,
					plan: workout.plan ? workout.plan.filter((week) => week) : [],
				};
			},
		});

		form.setFieldsValue(turnLoadPercentsIntoAbsoluteNumber(allValues));
		setState(newValues?.plan as FormWeek[]);
	};

	useEffect(() => {
		handleValuesChange(null, {
			plan: form.getFieldsValue().plan,
		} as FormWorkout);
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
		handleValuesChange(null, { plan: newPlan } as FormWorkout);
	};

	const handleApplyToAll = (weekIndex: number) => {
		const prevPlanState = form.getFieldValue('plan');
		const weekToApply = structuredClone(prevPlanState[weekIndex]);
		const newPlan = prevPlanState.map((originalWeek: FormWeek) => ({
			...weekToApply,
			weekTitle: originalWeek.weekTitle,
		}));

		form.setFieldsValue({
			plan: newPlan,
		});

		handleValuesChange(null, { plan: newPlan } as FormWorkout);
	};

	return (
		<div>
			<MobileView
				form={form}
				initialValues={initialValues}
				onSubmit={handleSubmit}
				onExport={handleExport}
				onDuplicate={handleDuplicate}
				onApplyToAll={handleApplyToAll}
				onApplyToTheNext={handleApplyToTheNext}
				onValuesChange={handleValuesChange}
				entitiesWithFocus={pickEntitiesWithFocus(state)}
				onClientChange={handleClientChange}
				categories={categories}
				exercise={exercise}
				clients={clients}
			/>
			<div className="desktop-view" style={{ margin: '2em 2em 0' }}>
				<Row>
					<Col
						xs={{ span: 24, offset: 0 }}
						sm={{ span: 16, offset: 4 }}
						md={{ span: 12, offset: 6 }}
						lg={{ span: 12, offset: 6 }}
						xl={{ span: 24, offset: 0 }}
					>
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
													<Button
														type="default"
														block
														onClick={handleDuplicate}
													>
														<CopyOutlined />{' '}
														<I18nMessage id="Workout.form.saveAndDuplicate" />
													</Button>
												</Form.Item>

												<Form.Item>
													<Button block htmlType="submit">
														<SaveOutlined />{' '}
														<I18nMessage id="Workout.form.save" />
													</Button>
												</Form.Item>

												{workoutId && (
													<Form.Item>
														<AddToFlowButton
															type="default"
															block
															workoutId={workoutId}
														/>
													</Form.Item>
												)}
											</Space>
										</Col>
									</Row>

									<Row gutter={16}>
										<Col span="3" offset="5">
											<div>
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
														style={{ width: '100%' }}
														onChange={handleClientChange}
													>
														{clients.map((client) => (
															<Select.Option
																key={client._id}
																value={client._id}
															>
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
														message: (
															<I18nMessage id="Workout.validation.workoutTitleIsRequired" />
														),
													},
													{
														max: MAX_TITLE_LENGTH,
														message: (
															<I18nMessage
																id="Workout.validation.workoutTitleMaxLength"
																value={{ maxLength: MAX_TITLE_LENGTH }}
															/>
														),
													},
													{
														min: MIN_TITLE_LENGTH,
														message: (
															<I18nMessage
																id="Workout.validation.workoutTitleMinLength"
																value={{ minLength: MIN_TITLE_LENGTH }}
															/>
														),
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
														message: (
															<I18nMessage
																id="Workout.validation.descriptionMaxLength"
																value={{ maxLength: MAX_DESCRIPTION_LENGTH }}
															/>
														),
													},
												]}
											>
												<Input.TextArea
													showCount
													maxLength={MAX_DESCRIPTION_LENGTH}
												/>
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
																<Col key={field.key} span={12}>
																	<WeekForm
																		formFieldValues={
																			form.getFieldsValue().plan
																				? form.getFieldsValue().plan[index]
																				: null
																		}
																		field={field}
																		remove={remove}
																		index={index}
																		onApplyToTheNext={() =>
																			handleApplyToTheNext(index)
																		}
																		onApplyToAll={() => handleApplyToAll(index)}
																	/>
																</Col>
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
					</Col>
				</Row>
			</div>
		</div>
	);
}

WorkoutAddEditForm.defaultProps = {
	clearAfterSubmit: false,
	error: undefined,
};
