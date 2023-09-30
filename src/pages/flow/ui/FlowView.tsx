import React, { useEffect } from 'react';

import WorkoutPlanFlow from './WorkoutPlanFlow';
import WeekFlow from './WeekFlow';
import DayFlow from './DayFlow';
import {
	getFlow,
	setFlowPath,
	useRecordFlowScroll,
} from '../../../features/workout/flow';
import type { WorkoutFlow } from '../../../features/workout/flow';
import { Workout } from '../../../entities/workout/model';

// ---

interface FlowViewProps {
	workout: Workout;
	onFlowChange: (flow: WorkoutFlow) => void;
	flow: WorkoutFlow;
}

export default function FlowView({
	workout,
	flow,
	onFlowChange,
}: FlowViewProps) {
	const currentWorkoutId = workout._id;
	const flowProgress = flow[currentWorkoutId];

	useEffect(() => {
		window.scrollTo(0, flowProgress.scrollPosition);
		/* eslint-disable */
	}, [workout._id]);

	const handleChooseWeek = (week: number) => {
		setFlowPath(currentWorkoutId, [week]);
		onFlowChange(getFlow());
	};

	const handleChooseDay = (week: number, day: number) => {
		setFlowPath(currentWorkoutId, [week, day]);
		onFlowChange(getFlow());
	};

	const resetFlow = () => {
		setFlowPath(currentWorkoutId, []);
		onFlowChange(getFlow());
	};

	const handleFlowPositionChange = () => {
		onFlowChange(getFlow());
	};

	useRecordFlowScroll(workout._id, handleFlowPositionChange);

	return (
		<div
			style={{
				marginBottom: '6em',
			}}
		>
			<div
				style={{
					marginTop: '1em',
				}}
			>
				{!flowProgress.path.length && (
					<WorkoutPlanFlow workout={workout} onChooseWeek={handleChooseWeek} />
				)}

				{flowProgress.path.length === 1 && workout?.plan?.length > 0 && (
					<WeekFlow
						week={workout.plan[flowProgress.path[0]]}
						workoutTitle={workout.title}
						weekIndex={flowProgress.path[0]}
						onChooseDay={handleChooseDay}
						onBack={() => resetFlow()}
					/>
				)}

				{flowProgress.path.length === 2 && (
					<DayFlow
						day={workout.plan[flowProgress.path[0]].days[flowProgress.path[1]]}
						weekTitle={workout?.plan[flowProgress.path[0]].weekTitle}
						onBack={() => handleChooseWeek(flowProgress.path[0])}
					/>
				)}
			</div>
		</div>
	);
}
