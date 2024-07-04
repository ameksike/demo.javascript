import { configureStore } from '@reduxjs/toolkit';
import counterReducer, { CounterState, counterKey } from './CounterSlice';

export const CounterStore = configureStore({
  reducer: {
    [counterKey]: counterReducer,
  },
});

export type RootState = ReturnType<typeof CounterStore.getState>;
export type AppDispatch = typeof CounterStore.dispatch;
export type { CounterState };