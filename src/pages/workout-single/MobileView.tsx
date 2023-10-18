import React, { useState } from 'react';
import {
	CopyOutlined,
	GoogleOutlined,
	PlusOutlined,
	QuestionCircleOutlined,
	SaveOutlined,
} from '@ant-design/icons';

import {
	Button,
	Col,
	Form,
	FormInstance,
	Row,
	Segmented,
	Select,
	Space,
	theme,
} from 'antd';
import { I18nMessage } from '../../shared/ui/i18n';
import { NewWorkout, Week } from '../../entities/workout/model';
import WeekForm from './WeekForm';

import CollapsibleBlock from '../../shared/ui/CollapsibleBlock';
import LoadCalculator from './LoadCalculator';
import TitleField from './ui/TitleField';
import DescriptionField from './ui/DescriptionField';
import { FormWeek, FormWorkout } from './types';
import { Category } from '../../entities/category/model';
import { Exercise } from '../../entities/exercise/model';
import { Client } from '../../entities/client/model';

// ---

interface MobileViewProps {
	onSubmit: (values: FormWorkout) => Promise<void>;
	onExport: () => void;
	onDuplicate: () => void;
	onValuesChange: (changedValues: unknown, values: FormWorkout) => void;
	onApplyToAll: (index: number) => void;
	onApplyToTheNext: (index: number) => void;
	onClientChange: (clientId: string) => void;
	form: FormInstance<FormWorkout>;
	initialValues: NewWorkout;
	entitiesWithFocus: FormWeek[];
	categories: Record<string, Category>;
	exercise: Record<string, Exercise>;
	clients: Client[];
}

const { useToken } = theme;

export default function MobileView({
	form,
	clients,
	initialValues,
	onDuplicate,
	onSubmit,
	onValuesChange,
	onExport,
	onApplyToAll,
	onClientChange,
	onApplyToTheNext,
	entitiesWithFocus,
	categories,
	exercise,
}: MobileViewProps) {
	// @ts-ignore
	const { token } = useToken();
	const [currentWeek, setCurrentWeek] = useState<number | string>(
		initialValues?.plan?.length ? 0 : 'new'
	);

	const handleWeekChange = (weekIndex: number | string) => {
		setCurrentWeek(weekIndex);
	};

	return (
		<div
			className="mobile-view"
			style={{
				height: 'calc(100vh - 64px - 151px - 32px - 1em)',
				overflow: 'auto',
			}}
		>
			<Row
				style={{
					padding: '1em 1em 30em',
				}}
			>
				<Col
					xs={{ span: 24, offset: 0 }}
					sm={{ span: 16, offset: 4 }}
					md={{ span: 12, offset: 6 }}
					lg={{ span: 12, offset: 6 }}
					xl={{ span: 8, offset: 8 }}
				>
					<Form
						form={form}
						initialValues={initialValues}
						onFinish={onSubmit}
						onValuesChange={onValuesChange}
						validateTrigger="onSubmit"
						layout="vertical"
						scrollToFirstError
					>
						<TitleField />

						<DescriptionField />

						<div>
							<Form.Item
								label={<I18nMessage id="Client.client" />}
								tooltip={{
									title: <I18nMessage id="Workout.form.selectClientTooltip" />,
									icon: <QuestionCircleOutlined />,
									placement: 'topLeft',
								}}
							>
								<Select
									size="small"
									showSearch
									style={{ width: '100%' }}
									onChange={onClientChange}
								>
									{clients.map((client) => (
										<Select.Option key={client._id} value={client._id}>
											{client.name}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</div>

						<div style={{ margin: '3em 0 0 0' }}>
							<Form.List name="plan">
								{(fields, { add, remove }) => (
									<>
										<Segmented
											style={{
												overflow: 'auto',
												width: '100%',
											}}
											options={[
												...(form.getFieldsValue().plan
													? form
															.getFieldsValue()
															.plan.map(
																({ weekTitle }: Week, index: number) => ({
																	label: weekTitle,
																	value: index,
																})
															)
													: []),
												{ label: 'New', value: 'new' },
											]}
											defaultValue={currentWeek}
											onChange={handleWeekChange}
										/>

										<div style={{ position: 'relative' }}>
											{fields.map((field, index) => (
												<div
													key={field.key}
													style={{
														position: 'absolute',
														top: '0',
														left: '0',
														zIndex: currentWeek === index ? 1 : 0,
														width: '100%',
													}}
												>
													<WeekForm
														formFieldValues={
															form.getFieldsValue().plan
																? form.getFieldsValue().plan[index]
																: null
														}
														field={field}
														remove={remove}
														index={index}
														onApplyToTheNext={() => onApplyToTheNext(index)}
														onApplyToAll={() => onApplyToAll(index)}
													/>
												</div>
											))}

											<div
												style={{
													position: 'absolute',
													top: '0',
													left: '0',
													width: '100%',
												}}
											>
												<Form.Item>
													<Button
														type="dashed"
														onClick={() => add()}
														block
														style={{ height: 'calc(357px + 2em)' }}
														icon={<PlusOutlined />}
													>
														{' '}
														<I18nMessage id="Workout.addWeek" />
													</Button>
												</Form.Item>
											</div>
										</div>
									</>
								)}
							</Form.List>
						</div>

						<div className="fixed">
							<CollapsibleBlock
								expandedHeight="405px"
								collapsedHeight="calc(1.5em + 130px)"
							>
								{(isExpanded: boolean) => (
									<LoadCalculator
										categories={categories}
										exercises={exercise}
										plan={entitiesWithFocus}
										showColumnTitles={isExpanded}
									/>
								)}
							</CollapsibleBlock>
							<Space
								style={{
									position: 'relative',
									width: '100%',
									overflow: 'auto',
									backgroundColor: token.colorBgElevated,
									zIndex: 1,
								}}
							>
								<Space
									direction="horizontal"
									style={{
										justifyContent: 'center',
										padding: '0.5em 1em',
									}}
								>
									<Form.Item style={{ marginBottom: '0px' }}>
										<Button block htmlType="submit">
											<SaveOutlined /> <I18nMessage id="Workout.form.save" />
										</Button>
									</Form.Item>

									<Form.Item style={{ marginBottom: '0px' }}>
										<Button type="default" block onClick={onExport}>
											<GoogleOutlined />{' '}
											<I18nMessage id="Workout.form.saveAndExport" />
										</Button>
									</Form.Item>

									<Form.Item style={{ marginBottom: '0px' }}>
										<Button type="default" block onClick={onDuplicate}>
											<CopyOutlined />{' '}
											<I18nMessage id="Workout.form.saveAndDuplicate" />
										</Button>
									</Form.Item>
								</Space>
							</Space>
						</div>
					</Form>
				</Col>
			</Row>
		</div>
	);
}
