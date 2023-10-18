import React from 'react';
import { Alert, Button, Table, Typography } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

import { Day, PlannedSet } from '../../../entities/workout/model';
import { selectExerciseEntities } from '../../../entities/exercise/lib/exercise-slice';
import { useAppSelector } from '../../../app/hooks';

import './day-view.css';
import { I18nMessage } from '../../../shared/ui/i18n';

// ---

interface DayViewProps {
	day: Day;
	weekTitle: string;
	onBack: () => void;
}

const columns = [
	{
		title: <I18nMessage id="Workout.load" />,
		dataIndex: 'load',
	},
	{
		title: <I18nMessage id="Workout.repeats" />,
		dataIndex: 'repeats',
	},
	{
		title: <I18nMessage id="Workout.tempo" />,
		dataIndex: 'tempo',
	},
	{
		title: <I18nMessage id="Workout.rest" />,
		dataIndex: 'rest',
	},
];

const { Text, Title } = Typography;

function SetsTable({ sets }: { sets: PlannedSet[] }) {
	return (
		<Table
			style={{ marginTop: '1em' }}
			pagination={false}
			columns={columns}
			dataSource={sets}
			size="small"
			bordered
		/>
	);
}

export default function DayFlow({ day, weekTitle, onBack }: DayViewProps) {
	const exercises = useAppSelector(selectExerciseEntities);

	return (
		<div>
			<div>
				<Button type="text" onClick={() => onBack()}>
					<LeftOutlined />{' '}
					<I18nMessage id="Common.backTo" value={{ what: weekTitle }} />
				</Button>
			</div>

			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<Title
					level={2}
					style={{
						marginTop: '1em',
						marginBottom: 0,
					}}
				>
					{day.dayTitle}
				</Title>
			</div>

			{day.exercises.map((exercise) => (
				<div
					key={exercise.exercise}
					style={{
						marginTop: '2em',
					}}
				>
					{exercises[exercise.exercise] ? (
						<>
							<Text className="exercise-title">
								{/* eslint-disable @typescript-eslint/no-non-null-assertion */}
								{exercises[exercise.exercise]!.name}
							</Text>
							<SetsTable sets={exercise.sets} />
						</>
					) : (
						<Alert
							message="Error"
							description="Error getting exercise data. Please consider removing this workout from Flow and adding it again, or contact support."
							type="error"
							showIcon
						/>
					)}
				</div>
			))}
		</div>
	);
}
