import { PlannedExercise } from '../../model';
import { MapExercise, MapSet } from './types';

// ---

export default function createMapExercise(
	onExercise?: MapExercise,
	mapSet?: MapSet
) {
	return (exercise: PlannedExercise | undefined | null) => {
		let modifiedExercise: PlannedExercise | undefined | null = exercise;

		if ((!onExercise && !mapSet) || !modifiedExercise) {
			return modifiedExercise;
		}

		if (onExercise) {
			modifiedExercise = onExercise(modifiedExercise);
		}

		if (mapSet && modifiedExercise?.sets) {
			modifiedExercise = {
				...modifiedExercise,
				// @ts-ignore
				sets: modifiedExercise.sets.map(mapSet),
			};
		}

		return modifiedExercise;
	};
}
