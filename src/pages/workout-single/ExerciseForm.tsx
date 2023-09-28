import React, { useState } from 'react';
import { Button, Divider, Form, Input, Select, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';

import { useAppSelector } from '../../app/hooks';
import { selectAllExercises } from '../../entities/exercise/lib/exercise-slice';
import { selectAllCategories } from '../../entities/category/lib/category-slice';
import { Category } from '../../entities/category/model';
import SetForm from './SetForm';
import { I18nMessage } from '../../shared/ui/i18n';
import { FormPlannedExercise, FormPlannedSet } from './types';

// ---

const MAX_SETS_COUNT = 10;
const MAX_MARK_LENGTH = 5;

interface ExerciseFormProps {
	name: number;
	remove: (name: number) => void;
	formFieldValues: FormPlannedExercise | null;
}

export default function ExerciseForm({
	name,
	remove,
	formFieldValues,
}: ExerciseFormProps) {
	const intl = useIntl();
	const exercises = useAppSelector(selectAllExercises);
	const categories = useAppSelector(selectAllCategories);

	const [categoryToFilterExercises, setCategoryToFilterExercises] =
		useState<string>('');

	const handleSelectCategory = (value: string) => {
		setCategoryToFilterExercises(value);
	};

	const defaultCategory: Category = { _id: '', name: 'All', color: '#000000' };

	const categoriesToChooseFrom = [defaultCategory, ...categories];

	return (
		<div>
			<div>
				<Space style={{ width: '100%', flexWrap: 'wrap' }}>
					<Form.Item
						style={{ marginBottom: '0', maxWidth: '75px' }}
						name={[name, 'mark']}
						rules={[
							{
								max: MAX_MARK_LENGTH,
								message: intl.formatMessage(
									{
										id: 'Workout.validation.exerciseMarkMaxLength',
									},
									{ maxLength: MAX_MARK_LENGTH }
								),
							},
						]}
					>
						<Input
							size="small"
							placeholder={intl.formatMessage({
								id: 'Workout.exerciseMark',
							})}
						/>
					</Form.Item>

					<Form.Item
						style={{ marginBottom: '0', maxWidth: '150px' }}
						name={[name, 'exercise']}
						rules={[
							{
								required: true,
								message: 'Missing exercise',
							},
						]}
					>
						<Select
							filterOption={(input, option) => {
								if (!option) {
									return false;
								}

								if (!option.categories.includes(categoryToFilterExercises)) {
									return false;
								}

								if (option.label) {
									return (
										option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
									);
								}

								return false;
							}}
							size="small"
							placeholder={intl.formatMessage({
								id: 'Exercise.selectExercise',
							})}
							showSearch
							options={exercises
								.filter((exercise) =>
									categoryToFilterExercises
										? exercise.categories.includes(categoryToFilterExercises)
										: true
								)
								.map((exercise) => ({
									label: exercise.name,
									value: exercise._id,
									categories: exercise.categories,
								}))}
						/>
					</Form.Item>

					<Select
						onSelect={handleSelectCategory}
						showSearch
						defaultValue={defaultCategory._id}
						filterOption={(input, option) => {
							if (!option) {
								return false;
							}

							if (option.label) {
								return (
									option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
								);
							}

							return false;
						}}
						style={{ width: 120 }}
						size="small"
						options={categoriesToChooseFrom.map((category) => ({
							label: category.name,
							value: category._id,
						}))}
					/>

					<Button size="small" onClick={() => remove(name)}>
						<DeleteOutlined />
					</Button>
				</Space>
			</div>
			<div style={{ marginTop: '16px' }}>
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
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
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

								<Button
									size="small"
									type="dashed"
									onClick={() => add()}
									icon={<PlusOutlined />}
								>
									{' '}
									<I18nMessage id="Workout.addSet" />
								</Button>
							</div>

							<Form.Item>
								<Form.ErrorList errors={errors} helpStatus="error" />
							</Form.Item>
						</>
					)}
				</Form.List>
			</div>
			<Divider />
		</div>
	);
}
