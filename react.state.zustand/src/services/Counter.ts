
import { create } from 'zustand';

export interface ICounter {
    count: number
    update: (increment: number) => void
}

const SCounter = create<ICounter>(set => ({
    count: 1,
    update: (increment: number) => set((state) => ({ count: state.count + increment })),
}));

export default SCounter;
