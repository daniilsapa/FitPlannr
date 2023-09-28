import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EntityId } from '@reduxjs/toolkit';
import { Alert, Col, Row, Spin } from 'antd';

import { useAppDispatch, useAppSelector } from '../../app/hooks';

// Models
import {
	PlannedExercise,
	PlannedSet,
	Workout,
} from '../../entities/workout/model';

// Slices
import {
	addWorkout,
	selectIsLoading as selectWorkoutsAreLoading,
	selectWorkoutById,
	updateWorkout,
} from '../../entities/workout/lib/workout-slice';
import { selectIsLoading as selectExercisesAreLoading } from '../../entities/exercise/lib/exercise-slice';
import { selectIsLoading as selectCategoriesAreLoading } from '../../entities/category/lib/category-slice';
import { selectIsLoading as selectClientsAreLoading } from '../../entities/client/lib/client-slice';

// API
import { exportWorkout } from '../../entities/workout/api';

// Styles
import './index.css';
import modifyWorkout from '../../entities/workout/lib/modify-workout/modify-workout';
import { FormPlannedExercise, FormPlannedSet, FormWorkout } from './types';
import WorkoutAddEditForm from './WorkoutForm';

// ---

interface ApiError {
	message: string;
	response?: {
		data?: {
			message: string;
		};
	};
}

const combineSimilarSets = (sets: PlannedSet[]): FormPlannedSet[] => {
	const theSame = (a: PlannedSet, b: PlannedSet) => {
		return (
			a.load === b.load &&
			a.repeats === b.repeats &&
			a.tempo === b.tempo &&
			a.rest === b.rest
		);
	};
	return sets.reduce((acc: FormPlannedSet[], set: PlannedSet) => {
		if (acc[acc.length - 1] && theSame(acc[acc.length - 1], set)) {
			return [
				...acc.slice(0, acc.length - 1),
				{ ...set, sets: acc[acc.length - 1].sets + 1 },
			];
		}
		return [...acc, { ...set, sets: 1 }];
	}, []);
};

const prepareInitialValues = (workout: Workout) => {
	return modifyWorkout(workout, {
		onExercise: (exercise?: PlannedExercise) => {
			if (!exercise) {
				return exercise;
			}

			return {
				...exercise,
				sets: combineSimilarSets(exercise.sets),
			};
		},
	});
};

export default function WorkoutSinglePage() {
	const loading = useAppSelector(
		(state) =>
			selectExercisesAreLoading(state) &&
			selectCategoriesAreLoading(state) &&
			selectClientsAreLoading(state) &&
			selectWorkoutsAreLoading(state)
	);
	const navigate = useNavigate();
	const { id } = useParams();
	const stored = useAppSelector((state) =>
		selectWorkoutById(state, id as EntityId)
	) as Workout;
	const dispatch = useAppDispatch();
	const [isPending, setIsPending] = React.useState(false);
	const [error, setError] = React.useState('');
	const initialWorkout =
		id && stored
			? prepareInitialValues(stored)
			: { title: '', description: '', plan: [] };

	const handleExport = async () => {
		try {
			if (id) {
				await exportWorkout(id);
			}
		} catch (e) {
			// TODO: move error extraction to api layer and remove the workaround
			const err = e as ApiError;
			setError(err?.response?.data?.message || err.message);
			setIsPending(false);
		}
	};

	const handleSubmit = async (values: FormWorkout) => {
		if (isPending) return;

		const preparedValues = modifyWorkout(values, {
			// @ts-ignore
			onExercise: (exercise?: FormPlannedExercise) => {
				if (!exercise || (exercise && !exercise.sets)) return exercise;

				return {
					...exercise,
					sets: exercise.sets.reduce(
						(acc: PlannedSet[], set: FormPlannedSet) => {
							const { sets, ...rest } = set;
							if (sets > 1) {
								return [...acc, ...Array(sets).fill(rest)];
							}
							return [...acc, rest];
						},
						[]
					),
				};
			},
		});

		setIsPending(true);
		try {
			await (id
				? dispatch(
						updateWorkout({
							...stored,
							...values,
							...preparedValues,
						})
				  )
				: dispatch(addWorkout(values))
			).unwrap();
		} catch (err) {
			const e = err as Error;
			setError(e.message);
		}

		setIsPending(false);
	};

	const handleDuplicate = () => {
		navigate('/workout');
	};

	let render = null;

	if (loading) {
		render = (
			<Spin tip="Loading" size="small">
				<div className="content" />
			</Spin>
		);
	} else if (id && !stored) {
		render = (
			<Row>
				<Col span="8" offset="8">
					<Alert type="error" message="Workout not found" banner />
				</Col>
			</Row>
		);
	} else {
		render = (
			<WorkoutAddEditForm
				isPending={isPending}
				error={error}
				initialValues={initialWorkout as FormWorkout}
				onSubmit={handleSubmit}
				onExport={handleExport}
				onDuplicate={handleDuplicate}
				clearAfterSubmit={!id}
			/>
		);
	}

	return <div>{render}</div>;
}
