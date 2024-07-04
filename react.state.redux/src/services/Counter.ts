import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './Store';
import { incrementByAmount, counterKey } from './CounterSlice';

/**
 * Convert the CounterSlice into a service as custom Hook
 * @returns {Object}
 */
const SCounter = () => {
    const count = useSelector((state: RootState) => state[counterKey].value);
    const dispatch = useDispatch();

    return {
        count,
        increment: (step?: number) => dispatch(incrementByAmount(step || 1)),
        decrement: (step?: number) => dispatch(incrementByAmount(step || 1)),
        reset: () => dispatch(incrementByAmount(0))
    };
};

export default SCounter;