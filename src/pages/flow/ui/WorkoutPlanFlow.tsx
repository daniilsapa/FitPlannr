import React from 'react';
import { Button, Empty } from 'antd';
import { RightOutlined } from '@ant-design/icons';

import { Workout } from '../../../entities/workout/model';

// ---

interface PlanViewProps {
	workout: Workout;
	onChooseWeek: (weekIndex: number) => void;
}

export default function WorkoutPlanFlow({
	workout,
	onChooseWeek,
}: PlanViewProps) {
	return (
		<div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<h2
					style={{
						padding: '4px 15px',
					}}
				>
					{workout.title}
				</h2>
			</div>
			{workout.plan.length === 0 && (
				<Empty
					style={{ paddingTop: '3em', paddingBottom: '3em' }}
					description="No weeks in the workout yet."
				/>
			)}
			{workout.plan.map((week, index) => (
				<div key={week.weekTitle}>
					<Button type="text" onClick={() => onChooseWeek(index)}>
						{week.weekTitle} <RightOutlined />
					</Button>
				</div>
			))}
		</div>
	);
}
