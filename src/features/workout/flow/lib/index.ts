import { FLOW_STORAGE_KEY } from '../config';
import { CreateFlowData, WorkoutFlow } from '../model';

// ---

export default function addToFlow(workoutId: string) {
	const flow: WorkoutFlow = JSON.parse(
		localStorage.getItem(FLOW_STORAGE_KEY) || '{}'
	);

	flow[workoutId] = CreateFlowData();

	localStorage.setItem(FLOW_STORAGE_KEY, JSON.stringify(flow));
}

export function removeFromFlow(workoutId: string) {
	const flow: WorkoutFlow = JSON.parse(
		localStorage.getItem(FLOW_STORAGE_KEY) || '{}'
	);

	delete flow[workoutId];

	localStorage.setItem(FLOW_STORAGE_KEY, JSON.stringify(flow));
}

export function getWorkoutsInFlow(): string[] {
	const flow: WorkoutFlow = JSON.parse(
		localStorage.getItem(FLOW_STORAGE_KEY) || '{}'
	);

	return Object.keys(flow);
}

export function getFlow(): WorkoutFlow {
	return JSON.parse(localStorage.getItem(FLOW_STORAGE_KEY) || '{}');
}

export function setFlowPath(workoutId: string, path: number[]) {
	const flow: WorkoutFlow = JSON.parse(
		localStorage.getItem(FLOW_STORAGE_KEY) || '{}'
	);

	flow[workoutId].path = path;

	localStorage.setItem(FLOW_STORAGE_KEY, JSON.stringify(flow));
}

export function setFlowScrollPosition(
	workoutId: string,
	scrollPosition: number
) {
	const flow: WorkoutFlow = JSON.parse(
		localStorage.getItem(FLOW_STORAGE_KEY) || '{}'
	);

	flow[workoutId].scrollPosition = scrollPosition;

	localStorage.setItem(FLOW_STORAGE_KEY, JSON.stringify(flow));
}
