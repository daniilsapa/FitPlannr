import { describe, expect, test } from 'vitest';

import createMapExercise from './create-map-exercise';
import { PlannedExercise } from '../../model';

// ---

const sampleSet = {
	load: '100',
	repeats: 10,
	tempo: 'average',
	rest: '1 min',
};

const sampleExercise = {
	exercise: '234dfe34ab34',
	sets: [sampleSet],
};

function addSet(exercise?: PlannedExercise) {
	if (!exercise) return exercise;

	return {
		...exercise,
		sets: [...exercise.sets, sampleSet],
	};
}

describe('createMapExercise', () => {
	test('should return the same exercise if onExercise is not defined', () => {
		const mapExercise = createMapExercise(undefined, undefined);
		expect(mapExercise(sampleExercise)).toBe(sampleExercise);
	});

	test('should return changed exercise if onExercise is defined', () => {
		const mapExercise = createMapExercise(addSet);
		const modifiedExercise = mapExercise(sampleExercise);
		expect(modifiedExercise).not.toBe(sampleExercise);
		expect(modifiedExercise).toStrictEqual({
			...sampleExercise,
			sets: [sampleSet, sampleSet],
		});
	});

	test('should return undefined if onExercise and exercise is undefined', () => {
		const mapSet = createMapExercise(undefined);
		expect(mapSet(undefined)).toBe(undefined);
	});
});
