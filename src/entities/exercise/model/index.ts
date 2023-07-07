export type Exercise = {
	_id: string;
	name: string;
	description: string;
	categories: string[];
	link: string;
};

export type NewExercise = Omit<Exercise, '_id'>;
