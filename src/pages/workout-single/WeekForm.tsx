import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import {
	Button,
	Card,
	Checkbox,
	Collapse,
	Form,
	FormListFieldData,
	Input,
	Popover,
	Space,
	Tooltip,
} from 'antd';
import {
	DeleteOutlined,
	DoubleRightOutlined,
	PlusOutlined,
} from '@ant-design/icons';
import { I18nMessage } from '../../shared/ui/i18n';
import { FormWeek } from './types';
import DayForm, { DayTitleForm } from './DayForm';
import { MIN_TITLE_LENGTH } from './constants';

// ---

const MAX_WEEK_TITLE_LENGTH = 20;

interface WeekFormProps {
	field: FormListFieldData;
	index: number;
	formFieldValues: FormWeek | null;
	remove: (name: number | number[]) => void;
	onApplyToTheNext: () => void;
	onApplyToAll: () => void;
}

export default function WeekForm({
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
		<div>
			<Card
				title={
					<Space.Compact>
						<Form.Item
							name={[field.name, 'weekTitle']}
							style={{ marginBottom: 0, maxWidth: '120px' }}
							initialValue={`${intl.formatMessage({ id: 'Workout.week' })} ${
								index + 1
							}`}
							rules={[
								{
									required: true,
									message: (
										<I18nMessage id="Workout.validation.weekTitleIsRequired" />
									),
								},
								{
									max: MAX_WEEK_TITLE_LENGTH,
									message: (
										<I18nMessage
											id="Workout.validation.weekTitleMaxLength"
											value={{ maxLength: MAX_WEEK_TITLE_LENGTH }}
										/>
									),
								},
								{
									min: MIN_TITLE_LENGTH,
									message: (
										<I18nMessage
											id="Workout.validation.weekTitleMinLength"
											value={{ minLength: MIN_TITLE_LENGTH }}
										/>
									),
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
									{' '}
									<I18nMessage id="Workout.addDay" />
								</Button>
							</>
						)}
					</Form.List>
				</div>
			</Card>
		</div>
	);
}
