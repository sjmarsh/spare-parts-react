import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import partsReducer from '../features/parts/partListSlice';
import partDetailReducer from '../features/parts/partDetailSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    parts: partsReducer,
    partDetail: partDetailReducer
  },
});
