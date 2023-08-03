import {
	createSlice,
	createAsyncThunk,
	createEntityAdapter,
} from '@reduxjs/toolkit';

import * as api from '../api';
import { Exercise, NewExercise } from '../model';

// ---

const exerciseAdapter = createEntityAdapter({
	selectId: (exercise: Exercise) => exercise._id,
	sortComparer: (a: Exercise, b: Exercise) => a.name.localeCompare(b.name),
});

export const fetchExercises = createAsyncThunk(
	'exercises/fetchExercises',
	async () => {
		const response = await api.getExercises();
		return response.data;
	}
);

export const addExercise = createAsyncThunk(
	'exercises/addExercise',
	async (exercise: NewExercise) => {
		const response = await api.createExercise(exercise);
		return response.data;
	}
);

export const deleteExercise = createAsyncThunk(
	'exercises/removeExercise',
	async (id: string) => {
		await api.deleteExercise(id);

		return id;
	}
);

export const updateExercise = createAsyncThunk(
	'exercises/updateExercise',
	async (exercise: Exercise) => {
		await api.updateExercise(exercise._id, exercise);
		return exercise;
	}
);

const initialState = exerciseAdapter.getInitialState({
	isLoading: true,
});

interface GlobalStatePart {
	exercises: typeof initialState;
}

const exerciseSlice = createSlice({
	name: 'exercises',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchExercises.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchExercises.fulfilled, (state, action) => {
				state.isLoading = false;
				exerciseAdapter.setAll(state, action.payload);
			})
			.addCase(addExercise.fulfilled, exerciseAdapter.addOne)
			.addCase(deleteExercise.fulfilled, exerciseAdapter.removeOne)
			.addCase(updateExercise.fulfilled, exerciseAdapter.upsertOne);
	},
});

export const {
	selectAll: selectAllExercises,
	selectById: selectExerciseById,
	selectIds: selectExerciseIds,
	selectEntities: selectExerciseEntities,
} = exerciseAdapter.getSelectors<GlobalStatePart>((state) => state.exercises);

export const selectIsLoading = (state: GlobalStatePart) =>
	state.exercises.isLoading;

export default exerciseSlice.reducer;
