import {
	createSlice,
	createEntityAdapter,
	createAsyncThunk,
} from '@reduxjs/toolkit';

import * as api from '../api';
import type { Category, NewCategory } from '../model';

// ---

const categoryAdapter = createEntityAdapter({
	selectId: (category: Category) => category._id,
	sortComparer: (a: Category, b: Category) => a.name.localeCompare(b.name),
});

export const fetchCategories = createAsyncThunk(
	'categories/fetchCategories',
	async () => {
		const response = await api.getCategories();
		return response.data;
	}
);

export const addCategory = createAsyncThunk(
	'categories/addCategory',
	async (category: NewCategory) => {
		const response = await api.createCategory(category);
		return response.data;
	}
);

export const deleteCategory = createAsyncThunk(
	'categories/removeCategory',
	async (id: string) => {
		await api.deleteCategory(id);

		return id;
	}
);

export const updateCategory = createAsyncThunk(
	'categories/updateCategory',
	async (category: Category) => {
		await api.updateCategory(category._id, category);
		return category;
	}
);

const initialState = categoryAdapter.getInitialState({
	isLoading: true,
});

interface GlobalStatePart {
	categories: typeof initialState;
}

const categorySlice = createSlice({
	name: 'categories',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCategories.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchCategories.fulfilled, (state, action) => {
				state.isLoading = false;
				categoryAdapter.setAll(state, action.payload);
			})
			.addCase(addCategory.fulfilled, (state, action) => {
				categoryAdapter.addOne(state, action.payload);
			})
			.addCase(deleteCategory.fulfilled, (state, action) => {
				categoryAdapter.removeOne(state, action.payload);
			})
			.addCase(updateCategory.fulfilled, (state, action) => {
				categoryAdapter.upsertOne(state, action.payload);
			});
	},
});

// Export the customized selectors for this adapter using `getSelectors`
export const {
	selectAll: selectAllCategories,
	selectById: selectCategoryById,
	selectIds: selectCategoryIds,
	selectEntities: selectCategoryEntities,
	// Pass in a selector that returns the posts slice of state
} = categoryAdapter.getSelectors((state: GlobalStatePart) => state.categories);

export const selectIsLoading = (state: GlobalStatePart) =>
	state.categories.isLoading;

export default categorySlice.reducer;
