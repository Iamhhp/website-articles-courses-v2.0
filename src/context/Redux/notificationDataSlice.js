import { createSlice } from '@reduxjs/toolkit';

const notificationDataSlice = createSlice({
  name: 'dataNotification',
  initialState: [
    // {
    //   id:72,
    //   msg:'Iamhhp',
    //   backgroundColor:''
    // }
  ],
  reducers: {
    addNotificationMsg: (state, action) => {
      const notiId = Math.random();
      return [...state, { id: notiId, backgroundColor: '#1cdd27', msg: action.payload }];
    },

    addNotificationErr: (state, action) => {
      const notiId = Math.random();
      return [...state, { id: notiId, backgroundColor: '#f90606', msg: action.payload }];
    },

    deleteNotification: (state, action) => {
      return [...state.filter((noti) => noti.id !== action.payload)];
    },
  },
});
export default notificationDataSlice;

export const { addNotificationMsg, addNotificationErr, deleteNotification } = notificationDataSlice.actions;
