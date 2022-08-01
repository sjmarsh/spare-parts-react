import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import partsListReducer from '../features/parts/partListSlice';
import partDetailReducer from '../features/parts/partDetailSlice';
import inventoryReducer from '../features/inventory/inventorySlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    partsList: partsListReducer,
    partDetail: partDetailReducer, 
    inventory: inventoryReducer
  },
});
