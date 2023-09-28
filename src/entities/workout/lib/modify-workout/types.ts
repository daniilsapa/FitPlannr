import { Day, PlannedExercise, PlannedSet, Week, Workout } from '../../model';

export type MapSet = (set?: PlannedSet) => PlannedSet | undefined | null;
export type MapExercise = (
	exercise?: PlannedExercise
) => PlannedExercise | undefined | null;
export type MapDay = (day?: Day) => Day | undefined | null;
export type MapWeek = (week?: Week) => Week | undefined | null;
export type MapWorkout = (workout?: Workout) => Workout | undefined | null;

export interface Mappers {
	onWorkout?: MapWorkout;
	onWeek?: MapWeek;
	onDay?: MapDay;
	onExercise?: MapExercise;
	onSet?: MapSet;
}
