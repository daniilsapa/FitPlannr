import { configureStore } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';

import userReducer from '../entities/user/lib/userSlice';
import categoryReducer from '../entities/category/lib/category-slice';
import exerciseReducer from '../entities/exercise/lib/exercise-slice';
import clientReducer from '../entities/client/lib/client-slice';
import workoutReducer from '../entities/workout/lib/workout-slice';

// ---

const store = configureStore({
	reducer: {
		user: userReducer,
		categories: categoryReducer,
		exercises: exerciseReducer,
		clients: clientReducer,
		workouts: workoutReducer,
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
