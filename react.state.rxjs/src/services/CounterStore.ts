import { BehaviorSubject } from 'rxjs';

/**
 * Create an RxJS store to manage the state. This store will use subjects and observables to manage and distribute the state.
 * - BehaviorSubject: Holds the current state and emits it to subscribers whenever it changes.
 * - counter$: An observable that components can subscribe to in order to get the current state.
 * - increment, decrement, reset: Functions to modify the state and emit the new state.
 */

// Define the initial state
const initialState = { count: 0 };

// Create a BehaviorSubject to hold the state
const counterSubject = new BehaviorSubject(initialState);

// Expose the state as an observable
export const counter$ = counterSubject.asObservable();

// Functions to modify the state
export const increment = (step?: number) => {
    counterSubject.next({ count: counterSubject.getValue().count + (step || 1) });
};

export const decrement = (step?: number) => {
    counterSubject.next({ count: counterSubject.getValue().count - (step || 1) });
};

export const reset = () => {
    counterSubject.next({ count: 0 });
};
