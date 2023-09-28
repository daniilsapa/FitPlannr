import { Day } from '../../model';
import { MapDay, MapExercise } from './types';

// ---

export default function createMapDay(
	onDay?: MapDay,
	mapExercise?: MapExercise
) {
	return (day?: Day): Day | undefined | null => {
		let modifiedDay: Day | undefined | null = day;

		if ((!onDay && !mapExercise) || !modifiedDay) {
			return modifiedDay;
		}

		if (onDay) {
			modifiedDay = onDay(modifiedDay);
		}

		if (mapExercise) {
			modifiedDay = {
				...modifiedDay,
				// @ts-ignore
				exercises: modifiedDay.exercises.map(mapExercise),
			};
		}

		return modifiedDay;
	};
}
