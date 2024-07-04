import { configureStore } from '@reduxjs/toolkit';
import counterReducer, { CounterState, counterKey } from './CounterSlice';

// register the services Slices
export const GlobalStore = configureStore({
  reducer: {
    [counterKey]: counterReducer,
  }
});
export type RootState = ReturnType<typeof GlobalStore.getState>;
export type AppDispatch = typeof GlobalStore.dispatch;

// export State types 
export type { CounterState };