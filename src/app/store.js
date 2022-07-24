import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import partsReducer from '../features/parts/partSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    parts: partsReducer
  },
});
