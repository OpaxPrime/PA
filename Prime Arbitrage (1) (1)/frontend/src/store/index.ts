import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import arbitrageReducer from './slices/arbitrageSlice';
import inventoryReducer from './slices/inventorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    arbitrage: arbitrageReducer,
    inventory: inventoryReducer,
  },
});

export type RootState = ReturnType < typeof store.getState > ;
export type AppDispatch = typeof store.dispatch;