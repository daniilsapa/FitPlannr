import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { ThunkDispatch } from 'redux-thunk';

import type { RootState } from '../../app/store';
// import { AnyAction } from 'redux';

// ---

interface CounterState {
	value: number;
}

const initialState: CounterState = { value: 0 };

export const counterSlice = createSlice({
	name: 'counter',
	initialState,
	reducers: {
		increment: (state) => {
			state.value += 1;
		},
		decrement: (state) => {
			state.value -= 1;
		},
		incrementByAmount: (state, action: PayloadAction<number, string>) => {
			state.value += action.payload;
		},
	},
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

type CounterAction = {
	type: string;
	payload?: number;
};

// type DispatchType = (args: CounterAction) => CounterAction;

// export const incrementAsync = createAsyncThunk(
// 	'counter/incrementAsync',
// 	async (amount: number) =>
// 		new Promise((resolve) => {
// 			setTimeout(() => resolve(amount), 1000);
// 		})
// );

type DispatchType = (args: CounterAction) => CounterAction;

export const incrementAsync = (amount: number) => (dispatch: DispatchType) => {
	setTimeout(() => {
		dispatch(incrementByAmount(amount));
	}, 1000);
};

export const selectCount = (state: RootState) => state.counter.value;

export default counterSlice.reducer;

// export const login = (
// 	username: string,
// 	password: string
// ): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
// 	// Invoke API
// 	return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
// 		return new Promise<void>((resolve) => {
// 			dispatch(isFetching(true));
// 			console.log('Login in progress');
//
// 			setTimeout(() => {
// 				dispatch(set('this_is_access_token'));
// 				setTimeout(() => {\
// 					dispatch(isFetching(false));
// 					console.log('Login done');
// 					resolve();
// 				}, 1000);
// 			}, 3000);
// 		});
// 	};
// };
