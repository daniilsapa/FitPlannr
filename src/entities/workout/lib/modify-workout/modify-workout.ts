import { Workout } from '../../model';
import { Mappers } from './types';
import createMapSet from './create-map-set';
import createMapExercise from './create-map-exercise';
import createMapDay from './create-map-day';
import createMapWeek from './create-map-week';

// ---

export default function modifyWorkout(workout: Workout, mappers: Mappers) {
	const { onWorkout, onWeek, onDay, onExercise, onSet } = mappers;
	const mapSet = createMapSet(onSet);
	const mapExercise = createMapExercise(onExercise, mapSet);
	const mapDay = createMapDay(onDay, mapExercise);
	const mapWeek = createMapWeek(onWeek, mapDay);

	let modifiedWorkout: Workout | undefined | null = workout;

	if ((!onWorkout && !mapWeek) || Object.keys(mappers).length === 0) {
		return workout;
	}

	if (onWorkout) {
		modifiedWorkout = onWorkout(modifiedWorkout);
	}

	if (mapWeek) {
		modifiedWorkout = {
			...modifiedWorkout,
			// @ts-ignore
			plan: modifiedWorkout.plan.map(mapWeek),
		};
	}

	return modifiedWorkout;
}
