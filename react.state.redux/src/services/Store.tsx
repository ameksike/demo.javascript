import { configureStore } from '@reduxjs/toolkit';
import counterReducer, { CounterState, counterKey } from './CounterSlice';
import { Provider } from 'react-redux';
import { FC, ReactNode } from 'react';

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

// export the global provider 
interface StoreProviderProps {
  children: ReactNode;
}
export const StoreProvider: FC<StoreProviderProps> = ({ children }) => {
  return (
    <Provider store={GlobalStore}>
      {children}
    </Provider>
  );
}