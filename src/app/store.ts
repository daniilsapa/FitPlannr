import { configureStore } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';

import userReducer from '../entities/user/lib/userSlice';
import counterReducer from '../entities/counter';

// ---

const store = configureStore({
	reducer: {
		counter: counterReducer,
		user: userReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;

export default store;
