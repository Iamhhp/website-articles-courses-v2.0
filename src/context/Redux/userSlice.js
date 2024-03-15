import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userData',
  initialState: {
    status: {
      isLogin: false,
      isRemember: false,
    },
    info: {
      id: -1,
      username: '',
      password: '',
      fName: '',
      lName: '',
      email: '',
      selectedCards: [],
      boughtCards: [],
    },
  },

  reducers: {
    // ////////////////////////////////////////////////////////////// Actions of Information User
    logOut: (state, action) => {
      return {
        status: {
          isLogin: false,
          isRemember: false,
        },
        info: {
          id: -1,
          username: '',
          password: '',
          fName: '',
          lName: '',
          email: '',
          selectedCards: [],
          boughtCards: [],
        },
      };
    },

    updateStatus: (state, action) => {
      return { info: { ...state.info }, status: { ...action.payload } };
    },

    changeUsername: (state, action) => {
      return {
        status: { ...state.status },
        info: { ...state.info, username: action.payload },
      };
    },

    changePassword: (state, action) => {
      return {
        status: { ...state.status },
        info: { ...state.info, password: action.payload },
      };
    },

    changeFName: (state, action) => {
      return {
        status: { ...state.status },
        info: { ...state.info, fName: action.payload },
      };
    },

    changeLName: (state, action) => {
      return {
        status: { ...state.status },
        info: { ...state.info, lName: action.payload },
      };
    },

    changeEmail: (state, action) => {
      return {
        status: { ...state.status },
        info: { ...state.info, email: action.payload },
      };
    },

    // ////////////////////////////////////////////////////////////// Actions of Cards Selected
    addSelectedCard: (state, action) => {
      return {
        status: { ...state.status },
        info: { ...state.info, selectedCards: [...state.info.selectedCards, action.payload] },
      };
    },

    deleteSelectedCard: (state, action) => {
      console.log(action.payload);
      return {
        status: { ...state.status },
        info: { ...state.info, selectedCards: state.info.selectedCards.filter((card) => card.id !== action.payload) },
      };
    },

    deleteAllSelectedCard: (state, action) => {
      return {
        status: { ...state.status },
        info: { ...state.info, selectedCards: [] },
      };
    },

    // ////////////////////////////////////////////////////////////// Actions of Cards Bought
    addBoughtCard: (state, action) => {
      return {
        status: { ...state.status },
        info: { ...state.info, boughtCards: [...state.info.boughtCards, ...action.payload] },
      };
    },

    // ////////////////////////////////////////////////////////////// Actions of update All data
    patchUserData: (state, action) => {
      console.log({ status: { ...state.status }, info: { ...state.info, ...action.payload } });
      return { status: { ...state.status }, info: { ...state.info, ...action.payload } };
    },

    putUserData: (state, action) => {
      return { status: { ...state.status }, info: { ...action.payload } };
    },
  },
});
export default userSlice;

export const {
  logOut,
  updateStatus,
  changeUsername,
  changePassword,
  changeFName,
  changeLName,
  changeEmail,
  addSelectedCard,
  deleteSelectedCard,
  deleteAllSelectedCard,
  addBoughtCard,
  patchUserData,
  putUserData,
} = userSlice.actions;
