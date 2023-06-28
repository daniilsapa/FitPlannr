import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { User } from '../model';
import { signIn, signUp, getProfile } from '../api';

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
	isAuthenticated: !!localStorage.getItem('auth-token'),
};

export const getUserProfile = createAsyncThunk(
	'user/getUserProfile',
	async () => {
		const response = await getProfile();
		return response.data;
	}
);

export const signUpUser = createAsyncThunk(
	'user/signUp',
	async (
		{
			email,
			password,
			inviteCode,
		}: { email: string; password: string; inviteCode: string },
		{ dispatch, getState }
	) => {
		const currentState: UserState = getState() as UserState;

		if (!currentState.isAuthenticated) {
			await signUp(email, password, inviteCode);
		}

		dispatch(getUserProfile());
	}
);

export const signInUser = createAsyncThunk(
	'user/signIn',
	async (
		{ email, password }: { email: string; password: string },
		{ dispatch, getState }
	) => {
		const currentState: UserState = getState() as UserState;

		if (!currentState.isAuthenticated) {
			const response = await signIn(email, password);

			if (response.status === 200) {
				localStorage.setItem('auth-token', response.data.accessToken);
			}
		}

		dispatch(getUserProfile());
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
