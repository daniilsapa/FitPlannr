import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { User } from '../model';
import { signIn, logOut, getProfile } from '../api';

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
	isLoading: true,
	isAuthenticated: false,
};

export const getUserProfile = createAsyncThunk(
	'user/getUserProfile',
	async () => {
		const response = await getProfile();
		return response.data;
	}
);

export const signOutUser = createAsyncThunk('user/signOut', async () => {
	await logOut();
});

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
		builder
			.addCase(signInUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(signInUser.fulfilled, (state) => {
				state.isAuthenticated = true;
			})
			.addCase(signOutUser.fulfilled, (state) => {
				state.isAuthenticated = false;
			})
			.addCase(getUserProfile.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isAuthenticated = true;
				state.user = action.payload;
			})
			.addCase(getUserProfile.rejected, (state) => {
				state.isLoading = false;
				state.isAuthenticated = false;
			});
	},
});

export const selectIsAuthenticated = (state: GlobalStatePart) =>
	state.user.isAuthenticated;

export const selectIsLoading = (state: GlobalStatePart) => state.user.isLoading;

export default slice.reducer;
