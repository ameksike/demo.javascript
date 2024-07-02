import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './CounterSlice';

export const CounterStore = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof CounterStore.getState>;
export type AppDispatch = typeof CounterStore.dispatch;