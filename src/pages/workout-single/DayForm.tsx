import React from 'react';
import { useIntl } from 'react-intl';
import { Button, Form, Input, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import ExerciseForm from './ExerciseForm';
import { I18nMessage } from '../../shared/ui/i18n';
import { FormDay } from './types';
import { MIN_TITLE_LENGTH } from './constants';

// ---

const MAX_DAY_TITLE_LENGTH = 20;

interface DayFormProps {
	name: number;
	formFieldValues: FormDay | null;
}

export default function DayForm({ name, formFieldValues }: DayFormProps) {
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
						{' '}
						<I18nMessage id="Workout.addExercise" />
					</Button>
				</>
			)}
		</Form.List>
	);
}

interface DayTitleFormProps {
	name: number;
	index: number;
	remove: (name: number | number[]) => void;
}

export function DayTitleForm({ name, index, remove }: DayTitleFormProps) {
	const intl = useIntl();

	return (
		<div style={{ display: 'flex' }}>
			<Space.Compact onClick={(e) => e.stopPropagation()}>
				<Form.Item
					name={[name, 'dayTitle']}
					style={{ maxWidth: '120px' }}
					initialValue={`${intl.formatMessage({ id: 'Workout.day' })} ${
						index + 1
					}`}
					rules={[
						{
							required: true,
							message: (
								<I18nMessage id="Workout.validation.dayTitleIsRequired" />
							),
						},
						{
							max: MAX_DAY_TITLE_LENGTH,
							message: (
								<I18nMessage
									id="Workout.validation.dayTitleMaxLength"
									value={{ maxLength: MAX_DAY_TITLE_LENGTH }}
								/>
							),
						},
						{
							min: MIN_TITLE_LENGTH,
							message: (
								<I18nMessage
									id="Workout.validation.dayTitleMinLength"
									value={{ minLength: MIN_TITLE_LENGTH }}
								/>
							),
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
