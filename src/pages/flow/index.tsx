import React, { useEffect, useState } from 'react';
import { Col, Empty, Row, Segmented, Spin, theme, Typography } from 'antd';
import { SegmentedValue } from 'antd/es/segmented';

import {
	selectAllWorkouts,
	selectIsLoading as selectWorkoutsAreLoading,
} from '../../entities/workout/lib/workout-slice';
import { useAppSelector } from '../../app/hooks';
import { selectIsLoading as selectExercisesAreLoading } from '../../entities/exercise/lib/exercise-slice';

// Lib
import { getFlow, flowColor } from '../../features/workout/flow';
import FlowView from './ui/FlowView';

// Styles
import './index.css';

// ---

const { Title } = Typography;

const { useToken } = theme;

export default function FlowPage() {
	const { token } = useToken();

	const areWorkoutsLoading = useAppSelector(selectWorkoutsAreLoading);
	const areExercisesLoading = useAppSelector(selectExercisesAreLoading);
	const isLoading = areWorkoutsLoading || areExercisesLoading;

	const allWorkouts = useAppSelector(selectAllWorkouts);
	const [flow, setFlow] = useState(getFlow());

	const workoutsPresentInFlow = allWorkouts.filter(
		(workout) => flow[workout._id]
	);
	const [currentWorkoutId, setCurrentWorkoutId] = useState<string | null>(
		workoutsPresentInFlow[0]?._id || null
	);

	useEffect(() => {
		if (!currentWorkoutId) {
			setCurrentWorkoutId(workoutsPresentInFlow[0]?._id || null);
		}
	}, [workoutsPresentInFlow, currentWorkoutId]);

	const currentWorkout = allWorkouts.find(
		(workout) => workout._id === currentWorkoutId
	);

	return (
		<div>
			<Spin spinning={isLoading}>
				<Row
					style={{
						margin: '0 1em 0',
					}}
				>
					<Col
						xs={{ span: 24, offset: 0 }}
						sm={{ span: 22, offset: 1 }}
						md={{ span: 18, offset: 3 }}
						lg={{ span: 14, offset: 5 }}
						xl={{ span: 10, offset: 7 }}
						xxl={{ span: 8, offset: 8 }}
					>
						<Title level={1} style={{ color: flowColor }}>
							Flow
						</Title>
						{currentWorkout && !isLoading ? (
							<>
								<div className="flow-selector-desktop">
									<Segmented
										size="large"
										options={workoutsPresentInFlow.map((workout) => ({
											label: workout.title,
											value: workout._id,
										}))}
										onChange={(value: SegmentedValue) =>
											setCurrentWorkoutId(value as string)
										}
									/>
								</div>
								<div
									className="flow-selector-mobile"
									style={{
										backgroundColor: token.colorBgElevated,
									}}
								>
									<Segmented
										size="large"
										options={workoutsPresentInFlow.map((workout) => ({
											label: workout.title,
											value: workout._id,
										}))}
										onChange={(value: SegmentedValue) =>
											setCurrentWorkoutId(value as string)
										}
									/>
								</div>
								<FlowView
									workout={currentWorkout}
									flow={flow}
									onFlowChange={setFlow}
								/>
							</>
						) : (
							<Empty
								style={{ paddingTop: '5em', paddingBottom: '5em' }}
								description="No workouts in Flow"
							/>
						)}
					</Col>
				</Row>
			</Spin>
		</div>
	);
}
