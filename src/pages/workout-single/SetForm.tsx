import React from 'react';
import { useIntl } from 'react-intl';
import { Button, Form, Input, InputNumber } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import { I18nMessage } from '../../shared/ui/i18n';

// ---

interface SetFormProps {
	name: number;
	remove: (name: number) => void;
}

const MAX_REPEATS_COUNT = 50;
const MAX_TEMPO_LENGTH = 20;
const MAX_REST_LENGTH = 15;
const MAX_LOAD_LENGTH = 15;

const setsRules = [
	{
		required: true,
		message: <I18nMessage id="Workout.validation.setsNumberIsRequired" />,
	},
	{
		pattern: /^[0-9]+$/,
		message: <I18nMessage id="Workout.validation.validNumber" />,
	},
];

const loadRules = [
	{
		required: true,
		message: <I18nMessage id="Workout.validation.loadIsRequired" />,
	},
	{
		max: MAX_LOAD_LENGTH,
		message: (
			<I18nMessage
				id="Workout.validation.loadMaxLength"
				value={{ maxLength: MAX_LOAD_LENGTH }}
			/>
		),
	},
];

const repeatsRules = [
	{
		required: true,
		message: <I18nMessage id="Workout.validation.repeatsNumberIsRequired" />,
	},
	{
		pattern: /^[0-9]+$/,
		message: <I18nMessage id="Workout.validation.validNumber" />,
	},
	{
		validator: async (_: unknown, repeats: string) => {
			if (Number(repeats) > MAX_REPEATS_COUNT) {
				return Promise.reject();
			}
			return Promise.resolve();
		},
		message: (
			<I18nMessage
				id="Workout.validation.repeatsMaxValue"
				value={{ maxValue: MAX_REPEATS_COUNT }}
			/>
		),
	},
];

const tempoRules = [
	{
		max: MAX_TEMPO_LENGTH,
		message: (
			<I18nMessage
				id="Workout.validation.tempoMaxLength"
				value={{ maxLength: MAX_TEMPO_LENGTH }}
			/>
		),
	},
];

const restRules = [
	{
		max: MAX_REST_LENGTH,
		message: (
			<I18nMessage
				id="Workout.validation.restMaxLength"
				value={{ maxLength: MAX_REST_LENGTH }}
			/>
		),
	},
];

export default function SetForm({ name, remove }: SetFormProps) {
	const intl = useIntl();

	return (
		<div className="set-form" style={{ display: 'flex', gap: '10px' }}>
			<Form.Item
				name={[name, 'sets']}
				style={{ marginBottom: '8px' }}
				rules={setsRules}
				initialValue={1}
			>
				<InputNumber
					placeholder={intl.formatMessage({
						id: 'Workout.sets',
					})}
					size="small"
				/>
			</Form.Item>

			<Form.Item
				name={[name, 'load']}
				style={{ marginBottom: '8px' }}
				rules={loadRules}
			>
				<Input
					placeholder={intl.formatMessage({
						id: 'Workout.load',
					})}
					size="small"
				/>
			</Form.Item>

			<Form.Item
				name={[name, 'repeats']}
				style={{ marginBottom: '8px' }}
				rules={repeatsRules}
			>
				<InputNumber
					size="small"
					min={1}
					max={MAX_REPEATS_COUNT}
					placeholder={intl.formatMessage({
						id: 'Workout.repeats',
					})}
				/>
			</Form.Item>

			<Form.Item
				name={[name, 'tempo']}
				style={{ marginBottom: '8px' }}
				rules={tempoRules}
			>
				<Input
					placeholder={intl.formatMessage({
						id: 'Workout.tempo',
					})}
					size="small"
				/>
			</Form.Item>

			<Form.Item
				name={[name, 'rest']}
				style={{ marginBottom: '8px' }}
				rules={restRules}
			>
				<Input
					placeholder={intl.formatMessage({
						id: 'Workout.rest',
					})}
					size="small"
				/>
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
