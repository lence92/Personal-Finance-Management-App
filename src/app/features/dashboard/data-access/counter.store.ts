import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

type CounterState = {
  count: number;
};

const initialState: CounterState = {
  count: 0,
};

export const CounterStore = signalStore(
  withState(initialState),

  withMethods((store) => ({
    increment(): void {
      patchState(store, {
        count: store.count() + 1,
      });
    },
  })),
);
