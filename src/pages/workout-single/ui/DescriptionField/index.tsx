import { Form, Input } from 'antd';
import React from 'react';

import { MAX_DESCRIPTION_LENGTH } from '../../constants';
import { I18nMessage } from '../../../../shared/ui/i18n';

// ---

export default function DescriptionField() {
	return (
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
			<Input.TextArea showCount maxLength={MAX_DESCRIPTION_LENGTH} />
		</Form.Item>
	);
}
