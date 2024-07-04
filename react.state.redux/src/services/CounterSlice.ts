import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// define the state model
export interface CounterState {
    value: number;
}

// define the state 
const initialState: CounterState = {
    value: 0,
};

// define the service key or name
export const counterKey = 'counter';

// define service reducers
const counterSlice = createSlice({
    name: counterKey,
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.value += action.payload;
        },
    },
});

// define service actions
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// export the reducer manager 
export default counterSlice.reducer;
