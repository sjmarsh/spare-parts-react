import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
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

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;