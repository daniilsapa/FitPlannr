import { describe, expect, test } from 'vitest';

import createMapSet from './create-map-set';
import { PlannedSet } from '../../model';

// ---

const sampleSet = {
	load: '100',
	repeats: 10,
	tempo: 'average',
	rest: '1 min',
};

function add20PercentLoad(set?: PlannedSet) {
	if (!set) return set;

	return {
		...set,
		load: `${Number(set.load) * 1.2}`,
	};
}

describe('createMapSet', () => {
	test('should return the same set if onSet is not defined', () => {
		const mapSet = createMapSet(undefined);
		expect(mapSet(sampleSet)).toBe(sampleSet);
	});

	test('should return changed set if onSet is defined', () => {
		const mapSet = createMapSet(add20PercentLoad);
		const modifiedSet = mapSet(sampleSet);
		expect(modifiedSet).not.toBe(sampleSet);
		expect(modifiedSet).toEqual({
			...sampleSet,
			load: '120',
		});
	});

	test('should return undefined if onSet and set is undefined', () => {
		const mapSet = createMapSet(undefined);
		expect(mapSet(undefined)).toBe(undefined);
	});
});
