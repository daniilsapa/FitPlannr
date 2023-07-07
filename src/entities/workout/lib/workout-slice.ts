import {
	createSlice,
	createEntityAdapter,
	createAsyncThunk,
} from '@reduxjs/toolkit';

import * as api from '../api';
import { Workout, NewWorkout } from '../model';

// ---

const workoutAdapter = createEntityAdapter({
	selectId: (workout: Workout) => workout._id,
	sortComparer: (a: Workout, b: Workout) => a.title.localeCompare(b.title),
});

export const fetchWorkouts = createAsyncThunk(
	'workouts/fetchWorkouts',
	async () => {
		const response = await api.getWorkouts();
		return response.data;
	}
);

export const addWorkout = createAsyncThunk(
	'workouts/addWorkout',
	async (workout: NewWorkout) => {
		const response = await api.createWorkout(workout);
		return response.data;
	}
);

export const deleteWorkout = createAsyncThunk(
	'workouts/removeWorkout',
	async (id: string) => {
		await api.deleteWorkout(id);
		return id;
	}
);

export const updateWorkout = createAsyncThunk(
	'workouts/updateWorkout',
	async (workout: Workout) => {
		await api.updateWorkout(workout._id, workout);
		return workout;
	}
);

interface GlobalStatePart {
	workouts: ReturnType<typeof workoutAdapter.getInitialState>;
}

export const workoutSlice = createSlice({
	name: 'workouts',
	initialState: workoutAdapter.getInitialState(),
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchWorkouts.fulfilled, workoutAdapter.setAll)
			.addCase(addWorkout.fulfilled, workoutAdapter.addOne)
			.addCase(deleteWorkout.fulfilled, workoutAdapter.removeOne)
			.addCase(updateWorkout.fulfilled, workoutAdapter.upsertOne);
	},
});

export const {
	selectAll: selectAllWorkouts,
	selectById: selectWorkoutById,
	selectIds: selectWorkoutIds,
} = workoutAdapter.getSelectors<GlobalStatePart>((state) => state.workouts);

export default workoutSlice.reducer;
