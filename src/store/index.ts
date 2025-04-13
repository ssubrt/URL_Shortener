import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import linkReducer from './slices/linkSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    links: linkReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;