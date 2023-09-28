import { describe, expect, test } from 'vitest';

import createMapDay from './create-map-day';
import { Day } from '../../model';

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

const sampleDay: Day = {
	dayTitle: 'Day 1',
	exercises: [sampleExercise],
};

function addExercise(day?: Day) {
	if (!day) return day;

	return {
		...day,
		exercises: [...day.exercises, sampleExercise],
	};
}

describe('createMapDay', () => {
	test('should return the same day if onDay is not defined', () => {
		const mapDay = createMapDay();
		expect(mapDay(sampleDay)).toBe(sampleDay);
	});

	test('should return changed day if onDay is defined', () => {
		const mapDay = createMapDay(addExercise);
		const modifiedDay = mapDay(sampleDay);
		expect(modifiedDay).not.toBe(sampleDay);
		expect(modifiedDay).toStrictEqual({
			...sampleDay,
			exercises: [sampleExercise, sampleExercise],
		});
	});

	test('should return undefined if onDay and day is undefined', () => {
		const mapDay = createMapDay(undefined);
		expect(mapDay(undefined)).toBe(undefined);
	});
});
