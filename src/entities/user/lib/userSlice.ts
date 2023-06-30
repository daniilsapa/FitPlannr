import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { User } from '../model';
import { signIn, getProfile, isAPIAuthenticated } from '../api';

// ---

interface UserState {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
}

interface GlobalStatePart {
	user: UserState;
}

const initialState: UserState = {
	user: null,
	isLoading: false,
	isAuthenticated: isAPIAuthenticated(),
};

export const getUserProfile = createAsyncThunk(
	'user/getUserProfile',
	async () => {
		const response = await getProfile();
		return response.data;
	}
);

export const signInUser = createAsyncThunk(
	'user/signIn',
	async (
		{ email, password }: { email: string; password: string },
		{ getState }
	) => {
		const currentState: UserState = getState() as UserState;

		if (!currentState.isAuthenticated) {
			await signIn(email, password);
		}
	}
);

const slice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(signInUser.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(signInUser.fulfilled, (state) => {
			state.isAuthenticated = true;
		});
		builder.addCase(getUserProfile.fulfilled, (state, action) => {
			state.isLoading = false;
			state.user = action.payload;
		});
	},
});

export const selectIsAuthenticated = (state: GlobalStatePart) =>
	state.user.isAuthenticated;

export default slice.reducer;
