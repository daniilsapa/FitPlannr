export type PlannedSet = {
	load: string;
	repeats: number;
	tempo: string;
	rest: string;
};

export type PlannedExercise = {
	exercise: string;
	mark: string;
	sets: PlannedSet[];
};

export type Day = {
	dayTitle: string;
	exercises: PlannedExercise[];
};

export type Week = {
	weekTitle: string;
	days: Day[];
};

export type Workout = {
	_id: string;
	title: string;
	description: string;
	plan: Week[];
};

export type NewWorkout = Omit<Workout, '_id'>;
