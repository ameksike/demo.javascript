import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './CounterStore';
import { incrementByAmount } from './CounterSlice';

const SCounter = () => {
    const count = useSelector((state: RootState) => state.counter.value);
    const dispatch = useDispatch();

    return {
        count,
        increment: (step?: number) => dispatch(incrementByAmount(step || 1)),
        decrement: (step?: number) => dispatch(incrementByAmount(step || 1)),
        reset: () => dispatch(incrementByAmount(0))
    };
};

export default SCounter;