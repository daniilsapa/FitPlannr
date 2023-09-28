import {
	Day,
	PlannedExercise,
	PlannedSet,
	Week,
	Workout,
} from '../../entities/workout/model';

// ---

export interface FormPlannedSet extends PlannedSet {
	sets: number;
}
export interface FormPlannedExercise extends PlannedExercise {
	sets: FormPlannedSet[];
}

export interface FormDay extends Day {
	exercises: FormPlannedExercise[];
	focused: boolean;
}
export interface FormWeek extends Week {
	days: FormDay[];
	focused: boolean;
}

export interface FormWorkout extends Workout {
	plan: FormWeek[];
}
