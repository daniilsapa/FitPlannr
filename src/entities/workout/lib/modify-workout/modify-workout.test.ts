import { describe, expect, test } from 'vitest';
import { Day, PlannedExercise, PlannedSet, Week, Workout } from '../../model';
import modifyWorkout from './modify-workout';

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

const sampleWorkout: Workout = {
	_id: '1234',
	title: 'Workout 1',
	description: 'Workout 1 description',
	plan: [sampleWeek],
};

function addLoad(set?: PlannedSet) {
	if (!set) return set;

	return {
		...set,
		load: String(Number(set.load) * 0.2 + Number(set.load)),
	};
}

function addSet(exercise?: PlannedExercise) {
	if (!exercise) return exercise;

	return {
		...exercise,
		sets: [...exercise.sets, sampleSet],
	};
}

function addExercise(day?: Day) {
	if (!day) return day;

	return {
		...day,
		exercises: [...day.exercises, sampleExercise],
	};
}

function addDay(week?: Week) {
	if (!week) return week;

	return {
		...week,
		days: [...week.days, sampleDay],
	};
}

function addWeek(workout?: Workout) {
	if (!workout) return workout;

	return {
		...workout,
		plan: [...workout.plan, sampleWeek],
	};
}

const setWithAddedLoad = {
	...sampleSet,
	load: '120',
};

describe('createModifyWorkout', () => {
	test('should return the same workout if no mappers are defined', () => {
		const modifiedWorkout = modifyWorkout(sampleWorkout, {});
		expect(modifiedWorkout).toBe(sampleWorkout);
	});

	test('should return the workout with modified set if onSet mapper is defined', () => {
		const modifiedWorkout = modifyWorkout(sampleWorkout, {
			onSet: addLoad,
		});
		expect(modifiedWorkout).not.toBe(sampleWorkout);
		expect(modifiedWorkout).toStrictEqual({
			...sampleWorkout,
			plan: [
				{
					...sampleWeek,
					days: [
						{
							...sampleDay,
							exercises: [
								{
									...sampleExercise,
									sets: [
										{
											...sampleSet,
											load: '120',
										},
									],
								},
							],
						},
					],
				},
			],
		});
	});

	test('should return the workout with modified exercise if onExercise mapper is defined', () => {
		const modifiedWorkout = modifyWorkout(sampleWorkout, {
			onExercise: addSet,
		});
		expect(modifiedWorkout).not.toBe(sampleWorkout);
		expect(modifiedWorkout).toStrictEqual({
			...sampleWorkout,
			plan: [
				{
					...sampleWeek,
					days: [
						{
							...sampleDay,
							exercises: [
								{
									...sampleExercise,
									sets: [sampleSet, sampleSet],
								},
							],
						},
					],
				},
			],
		});
	});

	test('should return the workout with modified day if onDay mapper is defined', () => {
		const modifiedWorkout = modifyWorkout(sampleWorkout, {
			onDay: addExercise,
		});
		expect(modifiedWorkout).not.toBe(sampleWorkout);
		expect(modifiedWorkout).toStrictEqual({
			...sampleWorkout,
			plan: [
				{
					...sampleWeek,
					days: [
						{
							...sampleDay,
							exercises: [sampleExercise, sampleExercise],
						},
					],
				},
			],
		});
	});

	test('should return the workout with modified week if onWeek mapper is defined', () => {
		const modifiedWorkout = modifyWorkout(sampleWorkout, {
			onWeek: addDay,
		});
		expect(modifiedWorkout).not.toBe(sampleWorkout);
		expect(modifiedWorkout).toStrictEqual({
			...sampleWorkout,
			plan: [
				{
					...sampleWeek,
					days: [sampleDay, sampleDay],
				},
			],
		});
	});

	test('should return a modified workout if onWorkout mapper is defined', () => {
		const modifiedWorkout = modifyWorkout(sampleWorkout, {
			onWorkout: addWeek,
		});
		expect(modifiedWorkout).not.toBe(sampleWorkout);
		expect(modifiedWorkout).toStrictEqual({
			...sampleWorkout,
			plan: [sampleWeek, sampleWeek],
		});
	});

	test('should return the modified workout if all possible mappers are defined', () => {
		const modifiedWorkout = modifyWorkout(sampleWorkout, {
			onSet: addLoad,
			onExercise: addSet,
			onDay: addExercise,
			onWeek: addDay,
			onWorkout: addWeek,
		});
		expect(modifiedWorkout).not.toBe(sampleWorkout);
		expect(modifiedWorkout).toStrictEqual({
			...sampleWorkout,
			plan: [
				{
					...sampleWeek,
					days: [
						{
							...sampleDay,
							exercises: [
								{
									...sampleExercise,
									sets: [setWithAddedLoad, setWithAddedLoad],
								},
								{
									...sampleExercise,
									sets: [setWithAddedLoad, setWithAddedLoad],
								},
							],
						},
						{
							...sampleDay,
							exercises: [
								{
									...sampleExercise,
									sets: [setWithAddedLoad, setWithAddedLoad],
								},
								{
									...sampleExercise,
									sets: [setWithAddedLoad, setWithAddedLoad],
								},
							],
						},
					],
				},
				{
					...sampleWeek,
					days: [
						{
							...sampleDay,
							exercises: [
								{
									...sampleExercise,
									sets: [setWithAddedLoad, setWithAddedLoad],
								},
								{
									...sampleExercise,
									sets: [setWithAddedLoad, setWithAddedLoad],
								},
							],
						},
						{
							...sampleDay,
							exercises: [
								{
									...sampleExercise,
									sets: [setWithAddedLoad, setWithAddedLoad],
								},
								{
									...sampleExercise,
									sets: [setWithAddedLoad, setWithAddedLoad],
								},
							],
						},
					],
				},
			],
		});
	});
});
