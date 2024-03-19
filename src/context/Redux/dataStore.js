import { configureStore } from '@reduxjs/toolkit';
import notificationDataSlice from './notificationDataSlice';
import userSlice from './userSlice';

export default configureStore({
  reducer: {
    user: userSlice.reducer,
    notificationData: notificationDataSlice.reducer,
  },
});
