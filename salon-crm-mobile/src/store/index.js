import {configureStore} from '@reduxjs/toolkit';
import userReducer         from './slices/userSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import offlineReducer      from './slices/offlineSlice';

export const store = configureStore({
  reducer: {
    user:         userReducer,
    appointments: appointmentsReducer,
    offline:      offlineReducer,
  },
});
