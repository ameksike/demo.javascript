import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './CounterStore';
import { incrementByAmount, counterKey } from './CounterSlice';

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