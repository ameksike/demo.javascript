/**
 * https://react.dev/reference/react/createContext
 */
import React, { useContext, useState, ReactNode } from 'react';

export interface CounterContextProps {
    count: number;
    increment: (step?: number) => void;
    decrement: (step?: number) => void;
    reset: () => void;
}

const CounterContext = React.createContext<CounterContextProps | undefined>(undefined);

export const CounterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [count, setCount] = useState<number>(0);

    const increment = (step?: number) => setCount(count + (step || 1));
    const decrement = (step?: number) => setCount(count - (step || 1));
    const reset = () => setCount(0);

    const value = {
        count,
        increment,
        decrement,
        reset
    };

    return (
        <CounterContext.Provider value={value}>
            {children}
        </CounterContext.Provider>
    );
};

export default function SCounter(): CounterContextProps {
    const context = useContext(CounterContext);
    if (!context) {
        throw new Error('useCounter must be used within a CounterProvider');
    }
    return context;
}
