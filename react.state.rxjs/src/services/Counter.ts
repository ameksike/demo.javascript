import { useState, useEffect } from 'react';
import { counter$, increment, decrement, reset } from './CounterStore';
/**
 * Custom hook to use the counter state
 *  - useState: Manages local state for the component.
 *  - useEffect: Subscribes to the RxJS observable when the component mounts and updates the local state whenever the RxJS state changes. It also cleans up the subscription when the component unmounts.
 */
const useCounter = (init?: number) => {
    const [count, setCount] = useState<number>(init ?? 0);
    useEffect(() => {
        const subscription = counter$.subscribe(state => {
            setCount(state.count);
        });

        // Cleanup subscription on unmount
        return () => subscription.unsubscribe();
    }, []);
    return { count, increment, decrement, reset };
};

export default useCounter;
