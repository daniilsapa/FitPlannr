import { describe, expect, test } from 'vitest';

import { Day, Week } from '../../model';
import createMapWeek from './create-map-week';

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

const sampleWeek: Week = {
	weekTitle: 'Week 1',
	days: [sampleDay],
};

function addDay(week?: Week) {
	if (!week) return week;

	return {
		...week,
		days: [...week.days, sampleDay],
	};
}

describe('createMapWeek', () => {
	test('should return the same week if onWeek is not defined', () => {
		const mapWeek = createMapWeek();
		expect(mapWeek(sampleWeek)).toBe(sampleWeek);
	});

	test('should return changed week if onWeek is defined', () => {
		const mapWeek = createMapWeek(addDay);
		const modifiedWeek = mapWeek(sampleWeek);
		expect(modifiedWeek).not.toBe(sampleWeek);
		expect(modifiedWeek).toStrictEqual({
			...sampleWeek,
			days: [sampleDay, sampleDay],
		});
	});

	test('should return undefined if onWeek and week is undefined', () => {
		const mapWeek = createMapWeek(undefined);
		expect(mapWeek(undefined)).toBe(undefined);
	});
});
