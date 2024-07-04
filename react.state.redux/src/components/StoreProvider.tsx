import { Provider } from 'react-redux';
import { FC, ReactNode } from 'react';
import { GlobalStore } from '../services/Store';

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

export default StoreProvider;