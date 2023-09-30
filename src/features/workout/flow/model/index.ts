export interface FlowData {
	path: number[]; // Path to a week/day in the workout plan (e.g. [0, 1] means 1st week, 2nd day)
	scrollPosition: number; // Scroll position in the workout plan
}

export type WorkoutFlow = Record<string, FlowData>;

export function CreateFlowData(
	initialPath: number[] = [],
	initialScrollPosition = 0
): FlowData {
	return {
		path: initialPath,
		scrollPosition: initialScrollPosition,
	};
}
