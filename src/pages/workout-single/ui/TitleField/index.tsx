import React from 'react';
import { Form, Input } from 'antd';

import { MAX_TITLE_LENGTH, MIN_TITLE_LENGTH } from '../../constants';
import { I18nMessage } from '../../../../shared/ui/i18n';

// ---

const validationRules = [
	{
		required: true,
		message: <I18nMessage id="Workout.validation.workoutTitleIsRequired" />,
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
];

export default function TitleField() {
	return (
		<Form.Item
			label={<I18nMessage id="Workout.title" />}
			name="title"
			rules={validationRules}
		>
			<Input showCount maxLength={MAX_TITLE_LENGTH} />
		</Form.Item>
	);
}
